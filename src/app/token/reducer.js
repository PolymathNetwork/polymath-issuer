// @flow

import { CONNECTED } from 'polymath-auth'
import { setHelpersNetwork } from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'

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
    case CONNECTED:
      setHelpersNetwork(action.params.name)
      return state
    default:
      return state
  }
}
