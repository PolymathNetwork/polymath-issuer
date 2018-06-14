// @flow

import { STO, CappedSTOFactory, SecurityToken } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { TwelveHourTime } from 'polymath-ui'
import type { STOFactory, STODetails, STOPurchase } from 'polymathjs/types'

import { formName as configureFormName } from './components/ConfigureSTOForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'

export const DATA = 'sto/DATA'
export const data = (contract: STO, details: ?STODetails) => ({ type: DATA, contract, details })

export const FACTORIES = 'sto/FACTORIES'
export const factories = (factories: Array<STOFactory>) => ({ type: FACTORIES, factories })

export const USE_FACTORY = 'sto/USE_FACTORY'
export const useFactory = (factory: STOFactory) => ({ type: USE_FACTORY, factory })

export const PURCHASES = 'sto/PURCHASES'
export const purchases = (purchases: Array<STOPurchase>) => ({ type: PURCHASES, purchases })

export const GO_BACK = 'sto/GO_BACK'
export const goBack = () => ({ type: GO_BACK })

export type Action =
  | ExtractReturn<typeof data>
  | ExtractReturn<typeof factories>

export const fetch = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const { token } = getState().token
    if (!token || !token.contract) {
      dispatch(ui.fetched())
      return
    }
    const sto = await token.contract.getSTO()
    dispatch(data(sto, sto ? await sto.getDetails() : null))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

// TODO @bshevchenko: update when core will allow to retrieve factories list
export const fetchFactories = () => async (dispatch: Function) => {
  dispatch(ui.fetching())
  try {
    dispatch(factories([{
      title: 'Capped STO',
      name: 'Polymath Inc.',
      desc: 'This smart contract creates a maximum number of tokens (i.e hard cap) which the total aggregate of tokens' +
      ' acquired by all investors cannot exceed. Security tokens are sent to the investor upon reception of the funds ' +
      '(ETH or POLY), and any security tokens left upon termination of the offering will not be minted.',
      isVerified: true,
      securityAuditLink: {
        title: 'Zeppelin Solutions',
        url: 'https://zeppelin.solutions/',
      },
      address: CappedSTOFactory.address,
      owner: await CappedSTOFactory.owner(),
    }]))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

const dateTimeFromDateAndTime = (date: Date, time: TwelveHourTime) =>
  new Date(date.valueOf() + ui.twelveHourTimeToMinutes(time) * 60000)

const getModuleAddressFromReceipt = (receipt: any) => {
  const log = receipt.events.LogModuleAdded
  if (!log) {
    return null
  }

  // eslint-disable-next-line no-underscore-dangle
  return log.returnValues._module
}

export const configure = () => async (dispatch: Function, getState: GetState) => {
  const { factory } = getState().sto
  const { token } = getState().token
  if (!factory || !token || !token.contract) {
    return
  }
  dispatch(ui.tx(
    'Configuring STO',
    async () => {
      const contract: SecurityToken = token.contract
      const { values } = getState().form[configureFormName]
      const [startDate, endDate] = values['start-end']
      const startDateWithTime = dateTimeFromDateAndTime(startDate, values.startTime)
      const endDateWithTime = dateTimeFromDateAndTime(endDate, values.endTime)
      const receipt = await contract.setSTO(
        factory.address,
        startDateWithTime,
        endDateWithTime,
        values.cap,
        values.rate,
        values.currency === 'ETH',
        contract.account,
      )
      const stoAddress = getModuleAddressFromReceipt(receipt)

      const accountData = ui.getAccountDataForFetch(getState())
      if (!accountData) {
        throw new Error('Not signed in')
      }

      const emailResult = await ui.offchainFetch({
        query: `
        mutation ($account: WithAccountInput!, $input: EmailSTOLaunchedInput!) {
          withAccount(input: $account) {
            sendEmailSTOLaunched(input: $input)
          }
        }
      `,
        variables: {
          account: {
            accountData: accountData,
          },
          input: {
            ticker: token.ticker,
            startDate: startDateWithTime.getTime().toString(),
            endDate: endDateWithTime.getTime().toString(),
            stoAddress: stoAddress,
            txHash: receipt.transactionHash,
          },
        },
      })

      if (emailResult.errors) {
        // eslint-disable-next-line no-console
        console.error('sendEmailSTOLaunched failed:', emailResult.errors)
      }
    },
    'STO Configured Successfully',
    () => {
      return dispatch(fetch())
    },
    `/dashboard/${token.ticker}/compliance`
  ))
}

export const fetchPurchases = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const contract = getState().sto.contract
    if (!contract) {
      return
    }
    dispatch(purchases(await contract.getPurchases()))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}
