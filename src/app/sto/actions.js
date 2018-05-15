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
    const token = getState().token.token
    if (!token || !token.contract) {
      return dispatch(ui.fetched())
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

export const configure = () => async (dispatch: Function, getState: GetState) => {
  try {
    const factory = getState().sto.factory
    if (!factory) {
      return
    }
    const token = getState().token.token
    if (!token || !token.contract) {
      return
    }
    dispatch(ui.txStart('Configuring STO'))
    const contract: SecurityToken = token.contract
    const values = getState().form[configureFormName].values
    const [startDate, endDate] = values['start-end']
    const receipt = await contract.setSTO(
      factory.address,
      dateTimeFromDateAndTime(startDate, values.startTime),
      dateTimeFromDateAndTime(endDate, values.endTime),
      values.cap,
      values.rate,
      values.currency === 'ETH',
      contract.account,
    )
    dispatch(fetch())

    const accountData = ui.getAccountData(getState())
    if (!accountData) {
      throw new Error('Not signed in')
    }
    delete accountData.account

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
          txHash: receipt.transactionHash,
        },
        input: {
          ticker: token.ticker,
        },
      },
    })

    if (emailResult.errors) {
      // eslint-disable-next-line no-console
      console.error('sendEmailSTOLaunched failed:', emailResult.errors)
    }

    dispatch(
      ui.txSuccess(
        'STO Details Configured Successfully',
        'Whitelist your investors',
        `/dashboard/${token.ticker}/whitelist`
      )
    )
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
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
