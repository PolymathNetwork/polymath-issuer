// @flow

import { CONNECTED } from 'polymath-auth'
import { setHelpersNetwork } from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'

import * as a from './actions'
import { DATA } from '../providers/actions'
import type { Action } from './actions'
import type { ServiceProvider } from '../providers/data'

export type TokenState = {
  token: ?SecurityToken,
  isFetched: boolean,
  providers: ?Array<ServiceProvider>,
}

const defaultState: TokenState = {
  token: null,
  isFetched: false,
  providers: null,
}

export default (state: TokenState = defaultState, action: Action) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        token: action.token,
        isFetched: true,
      }
    case DATA:
      return {
        ...state,
        providers: action.providers,
      }
    case CONNECTED:
      setHelpersNetwork(action.params.name)
      return state
    default:
      return state
  }
}
