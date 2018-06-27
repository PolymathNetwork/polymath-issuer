// @flow

import * as a from './actions'
import type { Action } from './actions'

export type TickerState = {
  isTickerReserved: boolean,
}

const defaultState: TickerState = {
  isTickerReserved: false,
}

export default (state: TickerState = defaultState, action: Action) => {
  switch (action.type) {
    case a.RESERVED:
      return {
        ...state,
        isTickerReserved: true,
      }
    default:
      return state
  }
}
