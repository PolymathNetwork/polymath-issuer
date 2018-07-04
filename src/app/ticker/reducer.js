// @flow

import * as a from './actions'
import type { Action } from './actions'

export type TickerState = {
  expiryLimit: number,
  isTickerReserved: boolean,
}

const defaultState: TickerState = {
  expiryLimit: 15,
  isTickerReserved: false,
}

export default (state: TickerState = defaultState, action: Action) => {
  switch (action.type) {
    case a.EXPIRY_LIMIT:
      return {
        ...state,
        expiryLimit: action.value,
      }
    case a.RESERVED:
      return {
        ...state,
        isTickerReserved: true,
      }
    default:
      return state
  }
}
