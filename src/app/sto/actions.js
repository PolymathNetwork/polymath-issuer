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
    const title = await CappedSTOFactory.getTitle()
    dispatch(factories([{
      title,
      name: 'Polymath Inc.',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore' +
      'et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip' +
      ' ex ea commodo consequat.',
      isVerified: true,
      securityAuditLink: {
        title: 'Zeppelin Solutions',
        url: 'https://zeppelin.solutions/',
      },
      address: CappedSTOFactory.address,
      owner: '0xd4fcfa94c48bd8a20cc9d047b59b79b59c1c324d',
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
    dispatch(ui.notify(
      'STO was successfully issued',
      true,
      'We have already sent you an email. Check your mailbox',
      ui.etherscanTx(receipt.transactionHash)
    ))
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
    dispatch(factories(await contract.getPurchases()))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}
