// @flow

import React from 'react'
import { STO, CappedSTOFactory, SecurityToken } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { TwelveHourTime } from 'polymath-ui'
import type { STOFactory, STODetails, STOPurchase } from 'polymathjs/types'

import { formName as configureFormName } from './components/ConfigureSTOForm'
import ConfiguredEmail from './components/ConfiguredEmail'
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
  const fee = await CappedSTOFactory.setupCost()
  const feeView = ui.thousandsDelimiter(fee)
  dispatch(ui.confirm(
    <div>
      <p>Once submitted to the blockchain, the dates for your offering cannot be changed.
        Please confirm dates with your Advisor and Legal providers before you click on &laquo;CONFIRM&raquo;.
        Also, note that Investors must be added to the whitelist before or while the STO is live,
         so they can participate to your fundraise and that all necessary documentation must be posted on your
          Securities Offering Site.
      </p>
      <p>Completion of your STO smart contract deployment and scheduling will require two wallet transactions.</p>
      <p>• The first transaction will be used to pay for the smart contract fee of:</p>
      <div className='bx--details poly-cost'>{feeView} POLY</div>
      <p>
        • The second transaction will be used to pay the mining fee (aka gas fee) to complete the
        scheduling of your STO.
      </p>
      <p>
        Hit &laquo;CANCEL&raquo; if you would like to edit the information provided or &laquo;CONFIRM&raquo; 
        if you have confirmed the details of your STO with your Advisor and are ready to proceed.
      </p>
    </div>,
    async () => { // $FlowFixMe
      if (getState().pui.account.balance.lt(fee)) {
        dispatch(ui.faucet(`The launching of a STO has a fixed cost of ${feeView} POLY.`))
        return
      }
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
          const isEthFundraise = values.currency === 'ETH'

          const receipt = await contract.setCappedSTO(
            startDateWithTime,
            endDateWithTime,
            values.cap,
            values.rate,
            isEthFundraise,
            values.fundsReceiver,
          )

          dispatch(ui.email(
            receipt.transactionHash,
            token.ticker + ' STO Created on Polymath',
            <ConfiguredEmail
              ticker={token.ticker}
              start={startDateWithTime}
              cap={values.cap}
              rate={values.rate}
              isPolyFundraise={!isEthFundraise}
              fundsReceiver={values.fundsReceiver}
              txHash={receipt.transactionHash}
            />
          ))
        },
        'STO Configured Successfully',
        () => {
          return dispatch(fetch())
        },
        `/dashboard/${token.ticker}/compliance`,
        undefined,
        false,
        token.ticker.toUpperCase() + ' STO Creation'
      ))
    },
    'Before You Proceed with your Security Token Offering Deployment and Scheduling',
    undefined,
    'pui-large-confirm-modal'
  ))
}

export const fetchPurchases = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const contract = getState().sto.contract // $FlowFixMe
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

export const exportInvestorsList = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.confirm(
    <p>Are you sure you want to export investors list?<br />It may take a while.</p>,
    async () => {
      dispatch(ui.fetching())
      try {
        const contract = getState().sto.contract // $FlowFixMe
        const purchases = await contract.getPurchases()

        let csvContent = 'data:text/csv;charset=utf-8,Address,Transaction Hash,Tokens Purchased,Amount Invested'
        purchases.forEach((purchase: STOPurchase) => {
          csvContent += '\r\n' + [
            purchase.investor,
            purchase.txHash,
            purchase.amount.toString(10),
            purchase.paid.toString(10),
          ].join(',')
        })

        window.open(encodeURI(csvContent))

        dispatch(ui.fetched())
      } catch (e) {
        dispatch(ui.fetchingFailed(e))
      }
    },
    'Proceeding with Investors List Export'
  ))
}
