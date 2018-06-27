import React from 'react'
import { TickerRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { SymbolDetails } from 'polymathjs/types'

import { formName } from './components/TickerForm'
import { formName as confirmEmailFormName } from '../ConfirmEmailPage'
import type { GetState } from '../../redux/reducer'

export const RESERVED = 'ticker/RESERVED'

export const reserve = () => async (dispatch: Function, getState: GetState) => {
  // TODO @bshevchenko: see below... const { isEmailConfirmed } = getState().pui.account
  const details: SymbolDetails = getState().form[formName].values
  dispatch(ui.tx(
    'Token symbol reservation',
    async () => {
      await TickerRegistry.registerTicker(details)
    },
    'Your Token Symbol Was Reserved Successfully',
    () => {
      dispatch({ type: RESERVED })
    },
    `/dashboard/${details.ticker}/providers`,
    undefined,
    true // TODO @bshevchenko: !isEmailConfirmed
  ))
}

export const confirmEmail = () => async (dispatch: Function, getState: GetState) => {
  const { email } = getState().form[confirmEmailFormName].values
  dispatch(ui.requestConfirmEmail(email))
}

export const tickerReservationEmail = () => async () => {
  try {
    const tokens = await TickerRegistry.getMyTokens()
    const token: SymbolDetails = tokens[0]
    const expiryLimit = await TickerRegistry.expiryLimit()

    await ui.email(
      token.txHash,
      token.ticker + ' Symbol Registered on Polymath',
      (
        <div>
          <p>
            {token.ticker.toUpperCase()} symbol has been registered on Polymath. You can see the
            transaction details <a href={ui.etherscanTx(token.txHash)}>here</a>.
          </p>
          <p>
            You have {expiryLimit / 24 / 60 / 60} days to&nbsp;
            <a href={window.location.origin + `/dashboard/${token.ticker}/providers`}>
              proceed with the token issuance
            </a> before the token symbol you registered expires and becomes available for others to use.
          </p>
          <p>
            If you have any questions please contact{' '}
            <a href='mailto:support@polymath.zendesk.com'>
              support@polymath.zendesk.com
            </a>.
          </p>
        </div>
      )
    )
  } catch (e) { // eslint-disable-next-line
    console.error('tickerReservationEmail', e)
  }
}
