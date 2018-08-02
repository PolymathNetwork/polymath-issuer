// @flow

import type { SymbolDetails } from 'polymathjs/types'

import * as a from './actions'
import type { Action } from './actions'

export type TickerState = {
  expiryLimit: number,
  isTickerReserved: boolean,
  tokens: Array<SymbolDetails>,
}

const defaultState: TickerState = {
  expiryLimit: 15,
  isTickerReserved: false,
  tokens: [],
}

export default (state: TickerState = defaultState, action: Action) => {
  switch (action.type) {
    case a.EXPIRY_LIMIT:
      return {
        ...state,
        expiryLimit: action.value,
      }
    case a.TOKENS:
      return {
        ...state,
        tokens: action.tokens,
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
