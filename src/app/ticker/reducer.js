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
  isEmailSent: boolean,
}

const defaultState: TickerState = {
  isRegistered: false,
  isSuccessPageInitialized: false,
  transaction: null,
  isEmailSent: true,
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
        isEmailSent: true,
      }
    default:
      return state
  }
}
