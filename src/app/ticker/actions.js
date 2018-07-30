import React from 'react'
import { TickerRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { SymbolDetails } from 'polymathjs/types'

import { formName } from './components/TickerForm'
import { formName as confirmEmailFormName } from '../ConfirmEmailPage'
import ReservedEmail from '../token/components/ReservedEmail'
import type { GetState } from '../../redux/reducer'

export const EXPIRY_LIMIT = 'ticker/EXPIRY_LIMIT'
export const expiryLimit = () => async (dispatch: Function) =>
  dispatch({ type: EXPIRY_LIMIT, value: await TickerRegistry.expiryLimitInDays() })

export const RESERVED = 'ticker/RESERVED'

export const TOKENS = 'ticker/TOKENS'

export const getMyTokens = () => async (dispatch: Function) => {
  const tokens = await TickerRegistry.getMyTokens()
  dispatch({ type: TOKENS, tokens })
  if (tokens.length) {
    dispatch({ type: RESERVED })
  }
}

export const reserve = () => async (dispatch: Function, getState: GetState) => {
  const { isEmailConfirmed } = getState().pui.account
  const fee = await TickerRegistry.registrationFee()
  const feeView = ui.thousandsDelimiter(fee) // $FlowFixMe
  const details: SymbolDetails = getState().form[formName].values
  dispatch(ui.confirm(
    <div>
      <p>Completion of your token symbol reservation will require two wallet transactions.</p>
      <p>- The first transaction will be used to pay for the token symbol reservation cost of:</p>
      <div className='bx--details poly-cost'>{feeView} POLY</div>
      <p>
      - The second transaction will be used to pay the mining fee (aka gas fee) to complete the reservation of
      your token symbol.
        <br />
      </p>
      <p>
      Please hit &laquo;CONFIRM&raquo; when you are ready to proceed. Once you hit &laquo;CONFIRM&raquo;,
       your Token Symbol reservation will be sent to the blockchain and will be immutable until it expires.
        Any change prior to your reservation expiry will require that you start the process over using another token
         symbol.<br /> If you do not wish to pay the token symbol reservation fee or wish to review your information,
          simply select &laquo;CANCEL&raquo;.
      </p>
    </div>,
    async () => {
      if (getState().pui.account.balance.lt(fee)) {
        dispatch(ui.faucet(`The reservation of a token symbol has a fixed cost of ${feeView} POLY.`))
        return
      }
      dispatch(ui.tx(
        ['Approving POLY Spend', 'Reserving'],
        async () => {
          await TickerRegistry.registerTicker(details)
          if (isEmailConfirmed) {
            dispatch(tickerReservationEmail())
          }
        },
        `Your Token Symbol ${details.ticker} Was Reserved Successfully`,
        () => {
          dispatch({ type: RESERVED })
        },
        `/dashboard/${details.ticker}/providers`,
        undefined,
        !isEmailConfirmed,
        details.ticker.toUpperCase() + ' Token Symbol Reservation',
      ))
    },
    `Before you Proceed with Your ${details.ticker.toUpperCase()} Token Symbol Reservation`,
    undefined,
    'pui-large-confirm-modal'
  ))
}

export const confirmEmail = () => async (dispatch: Function, getState: GetState) => {
  const { email } = getState().form[confirmEmailFormName].values
  dispatch(ui.requestConfirmEmail(email))
}

export const tickerReservationEmail = () => async (dispatch: Function, getState: GetState) => {
  try {
    const tokens = await TickerRegistry.getMyTokens()
    const token: SymbolDetails = tokens.pop()

    dispatch(ui.email(
      token.txHash,
      token.ticker + ' Symbol Reserved on Polymath',
      <ReservedEmail token={token} expiryLimit={getState().ticker.expiryLimit} />
    ))
  } catch (e) { // eslint-disable-next-line
    console.error('tickerReservationEmail', e)
  }
}

