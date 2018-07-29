// @flow

import React from 'react'
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

export const PAUSE_STATUS = 'sto/PAUSE_STATUS'
export const pauseStatus = (status: boolean) => ({ type: PAUSE_STATUS, status })

export type Action =
  | ExtractReturn<typeof data>
  | ExtractReturn<typeof pauseStatus>
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
    if (sto) {
      dispatch(pauseStatus(await sto.paused()))
    }
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

export const configure = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.confirm(
    <div>
      <p>
        Once submitted to the blockchain, the dates for your
        offering cannot be changed.
      </p>
      <p>
        Please confirm dates with your Advisor and Legal
        providers before you click on &laquo;CONTINUE&raquo;.
      </p>
      <p>
        Investors must be added to the whitelist before or while
        the STO is live, so they can participate to your
        fundraise.
      </p>
      <p>
        All necessary documentation must be posted on your
        Securities Offering Site.
      </p>
    </div>,
    async () => {
      const fee = await CappedSTOFactory.setupCost()
      const feeView = ui.thousandsDelimiter(fee) // $FlowFixMe
      if (getState().pui.account.balance.lt(fee)) {
        dispatch(ui.faucet(`The launching of a STO has a fixed cost of ${feeView} POLY.`))
        return
      }
      dispatch(ui.confirm(
        <div>
          <p>Completion of your STO smart contract deployment and scheduling will require two wallet transactions.</p>
          <p>The first transaction will be used to pay for the smart contract fee of:</p>
          <div className='bx--details'>{feeView} POLY</div>
          <p>
            The second transaction will be used to pay the mining fee (aka gas fee) to complete the
            scheduling of your STO. Please hit &laquo;CONFIRM&raquo; when you are ready to proceed.
          </p>
        </div>,
        async () => {
          const { factory } = getState().sto
          const { token } = getState().token
          if (!factory || !token || !token.contract) {
            return
          }
          dispatch(ui.tx(
            ['Approving POLY Spend', 'Deploying And Scheduling'],
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
                values.fundsReceiver,
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
        },
        'Proceeding with Smart Contract Deployment and Scheduling'
      ))
    },
    'Before You Launch Your Security Token Offering',
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

export const togglePauseSto = (endDate: Date ) => async (dispatch: Function, getState: GetState) => {
  const isStoPaused = getState().sto.pauseStatus
  dispatch(ui.confirm(
    isStoPaused ? (
      <div>
        <p>
          Once you hit &laquo;CONFIRM&raquo;, the STO will resume, allowing Investors to contribute funds
          again. Please consult with your Advisor and provide your Investors with sufficient disclosure prior
          to confirming the action.<br />
          If you are not sure or would like to consult your Advisor,
          simply select &laquo;CANCEL&raquo;.
        </p>
        <br />
        <ui.Remark title='Note'>
          Your offering end-date will not be changed as a result of this operation.
        </ui.Remark>
      </div>
    ) : (
      <p>
        Once you hit &laquo;CONFIRM&raquo;, the STO will pause and Investors will no longer be able to
        contribute funds. Please consult with your Advisor and provide your Investors with sufficient
        disclosure prior to confirming the action.
        <br />
        If you are not sure or would like to consult your Advisor, simply select &laquo;CANCEL&raquo;.
      </p>
    ),
    async () => {
      dispatch(ui.tx(
        [isStoPaused ? 'Resuming STO': 'Pausing STO'],
        async () => {
          const contract: STO = getState().sto.contract
          if (isStoPaused) {
            await contract.unpause(endDate)
          } else {
            await contract.pause()
          }
          dispatch(pauseStatus(await contract.paused()))
        },
        isStoPaused ? 'Successfully Resumed STO': 'Successfully Paused STO',
        undefined,
        undefined,
        undefined,
        true,
      ))
    },
    `Before You Proceed with ${isStoPaused ? 'Resuming' : 'Pausing'} the STO`
  ))
}
