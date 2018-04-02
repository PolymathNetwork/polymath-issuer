// @flow

import type { SecurityToken } from 'polymath.js_v2/types'

import * as a from './actions'
import type { Action } from './actions'

export type TokenState = {
  token: ?SecurityToken,
  isFetched: boolean,
}

const defaultState: TokenState = {
  token: null,
  isFetched: false,
}

export default (state: TokenState = defaultState, action: Action) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        token: action.token,
        isFetched: true,
      }
    default:
      return state
  }
}
