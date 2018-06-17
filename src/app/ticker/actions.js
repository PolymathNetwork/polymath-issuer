import React from 'react'
import { TickerRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { SymbolDetails } from 'polymathjs/types'

import { formName } from './components/TickerForm'
import { formName as confirmEmailFormName } from './ConfirmEmailPage'
import type { GetState } from '../../redux/reducer'
import type { ExtractReturn } from '../../redux/helpers'

export const REGISTERED = 'ticker/REGISTERED'
export const registered = () => ({ type: REGISTERED })

export const SUCCESS_PAGE_INIT = 'ticker/SUCCESS_PAGE_INIT'
export const successPageInitialized = (initialized: boolean) => ({ type: SUCCESS_PAGE_INIT, initialized })

export const TX = 'ticker/TX'
export const setTransaction = (transaction: boolean) => ({ type: TX, transaction })

export const EMAIL_SENT = 'ticker/EMAIL_SENT'
export const emailSent = () => ({ type: EMAIL_SENT })

export const LAST_CONFIRMATION_EMAIL = 'ticker/LAST_CONFIRMATION_EMAIL'
export const confirmationEmailSent = (email: string) => ({ type: LAST_CONFIRMATION_EMAIL, email })

export type Action =
  | ExtractReturn<typeof registered>
  | ExtractReturn<typeof successPageInitialized>
  | ExtractReturn<typeof setTransaction>
  | ExtractReturn<typeof emailSent>
  | ExtractReturn<typeof confirmationEmailSent>

// eslint-disable-next-line
export const register = () => async (dispatch: Function, getState: GetState) => {
  dispatch(
    ui.confirm(
      'Before you proceed with your Token Symbol Reservation',
      <div>
        <p>
          Please confirmed that all previous information is correct and that you are not violating any trademarks.<br />
        </p>
        <p>
          Once you hit “CONFIRM”, your Token Symbol registration will be sent to the blockchain and will be
          immutable.Any change will require that you start the process over.If you wish to review your information,
          please select “CANCEL”
        </p>
      </div>,
      'red',
      async () => {
        dispatch(ui.txStart('Submitting token symbol reservation...'))
        try {
          const details: SymbolDetails = getState().form[formName].values
          await TickerRegistry.registerTicker(details)

          dispatch(ui.txEnd(null))
          dispatch(registered())
        } catch (e) {
          dispatch(ui.txFailed(e))
        }
      },
    ),
  )
}

export const initSuccessPage = () => async (dispatch: Function) => {
  dispatch(successPageInitialized(false))

  // eslint-disable-next-line no-underscore-dangle
  const results = await TickerRegistry._getRegisterTickerEvents()

  const latestEvent = results.reduce(
    // eslint-disable-next-line no-underscore-dangle
    (latest, event) => (latest && latest.returnValues._timestamp > event.returnValues._timestamp ? latest : event),
    null,
  )

  if (latestEvent == null) {
    dispatch(setTransaction(null))
    dispatch(successPageInitialized(false))
    return
  }

  const tx = {
    // eslint-disable-next-line no-underscore-dangle
    name: latestEvent.returnValues._name,
    // eslint-disable-next-line no-underscore-dangle
    ticker: latestEvent.returnValues._symbol,
    txHash: latestEvent.transactionHash,
  }

  dispatch(ui.txHash(tx.txHash))
  dispatch(
    ui.txSuccess(
      'Your Token Symbol Was Reserved Successfully',
      'Choose your providers',
      `/dashboard/${tx.ticker}/providers`,
    ),
  )

  dispatch(setTransaction(tx))
  dispatch(successPageInitialized(true))
}

export const sendRegisterTickerEmail = () => async (dispatch: Function, getState: GetState) => {
  if (getState().ticker.isTickerEmailSent) {
    return
  }
  dispatch(emailSent())

  const accountData = ui.getAccountDataForFetch(getState())
  if (!accountData) {
    throw new Error('Not signed in')
  }

  const tx = getState().ticker.transaction
  if (!tx) {
    throw new Error('No transaction in sendRegisterTickerEmail.')
  }

  const emailResult = await ui.offchainFetch({
    query: `
      mutation ($account: WithAccountInput!, $input: EmailRegisterTickerInput!) {
        withAccount(input: $account) {
          sendEmailRegisterTicker(input: $input)
        }
      }
    `,
    variables: {
      account: {
        accountData: accountData,
      },
      input: tx,
    },
  })

  if (emailResult.errors) {
    // eslint-disable-next-line no-console
    console.error('sendEmailRegisterTicker failed:', emailResult.errors)
  }
}

export const confirmEmail = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.txStart('Requesting your signature...'))
  try {
    const prevAccountData = ui.getAccountData(getState())
    if (!prevAccountData) {
      throw new Error('Not signed in')
    }
    const prevAccount = prevAccountData.account
    const account = {
      name: prevAccount.name,
      email: getState().form[confirmEmailFormName].values.email,
    }

    await dispatch(ui.updateAccount(account))
    dispatch(ui.txStart('Sending a confirmation email...'))
    await dispatch(ui.sendActivationEmail())
    dispatch(confirmationEmailSent(account.email))

    dispatch(ui.notify('Check your inbox for a confirmation email.', true))
    dispatch(ui.txEnd({}))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
