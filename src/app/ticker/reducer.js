// @flow

import * as a from './actions'
import type { Action } from './actions'

export type TickerTransaction = {
  name: string,
  ticker: string,
  txHash: string,
}

export type TickerState = {
  isRegistered: boolean,
  isSuccessPageInitialized: boolean,
  transaction: ?TickerTransaction,
  isTickerEmailSent: boolean,
  lastConfirmationEmailAddress: ?string,
}

const defaultState: TickerState = {
  isRegistered: false,
  isSuccessPageInitialized: false,
  transaction: null,
  isTickerEmailSent: false,
  lastConfirmationEmailAddress: null,
}

export default (state: TickerState = defaultState, action: Action) => {
  switch (action.type) {
    case a.REGISTERED:
      return {
        ...state,
        isRegistered: true,
      }
    case a.SUCCESS_PAGE_INIT:
      return {
        ...state,
        isSuccessPageInitialized: action.initialized,
      }
    case a.TX:
      return {
        ...state,
        transaction: action.transaction,
      }
    case a.EMAIL_SENT:
      return {
        ...state,
        isTickerEmailSent: true,
      }
    case a.LAST_CONFIRMATION_EMAIL:
      return {
        ...state,
        lastConfirmationEmailAddress: action.email,
      }
    default:
      return state
  }
}
