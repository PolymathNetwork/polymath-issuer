// @flow

import { STO, CappedSTOFactory, SecurityToken } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { TwelveHourTime } from 'polymath-ui'
import type { STOFactory, STODetails, STOPurchase, Address } from 'polymathjs/types'

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

export const PAUSE_STATUS = 'sto/PAUSE_STATUS'
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
      desc: 'This smart contract creates a maximum number of tokens (i.e hard cap) which the total ' +
      'aggregate of tokens acquired by all investors cannot exceed. Security tokens are sent to the investor upon' +
      ' reception of the funds (ETH or POLY), and any security tokens left upon termination of the offering ' +
      'will not be minted.',
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

export const configure = (polyCost: number, fundsReceiver: Address) => 
  async (dispatch: Function, getState: GetState) => {

    const { factory } = getState().sto
    const { token } = getState().token

    if (!factory || !token || !token.contract) {
      return
    }
    dispatch(ui.tx(
      ['STO Smart Contract Fee', 'STO Smart Contract Deployment and Scheduling'],
      async () => {
        const contract: SecurityToken = token.contract
        const { values } = getState().form[configureFormName]
        const [startDate, endDate] = values['start-end']
        const startDateWithTime = dateTimeFromDateAndTime(startDate, values.startTime)
        const endDateWithTime = dateTimeFromDateAndTime(endDate, values.endTime)

        await contract.setCappedSTO(
          startDateWithTime,
          endDateWithTime,
          values.cap,
          values.rate,
          values.currency === 'ETH',
          fundsReceiver,
        )
      },
      'STO Configured Successfully',
      () => {
        return dispatch(fetch())
      },
      `/dashboard/${token.ticker}/compliance`,
      undefined,
      true, // TODO @bshevchenko
      token.ticker.toUpperCase() + ' STO Creation' 
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

export const togglePauseSto = (endDate: Date ) =>
  async (dispatch: Function, getState: GetState) =>{
    const { pauseStatus } = getState().sto
    dispatch(ui.tx(
      [pauseStatus ? 'Resuming STO': 'Pausing STO'],
      async () => {
        if(pauseStatus){
          // $FlowFixMe
          await getState().sto.contract.unpause(endDate)
        }else{
          // $FlowFixMe
          await getState().sto.contract.pause()
        }
        // $FlowFixMe
        dispatch({ type: PAUSE_STATUS, status: await getState().sto.contract.paused() })
      },
      pauseStatus ? 'Successfully Resumed STO': 'Successfully Paused STO',
      undefined,
      undefined,
      undefined,
      true,
    ))
  }

export const getPauseStatus = () => async (dispatch: Function, getState: GetState) =>{
  if(getState().sto.contract){
    // $FlowFixMe
    dispatch({ type: PAUSE_STATUS, status: await getState().sto.contract.paused() })
  }
}
