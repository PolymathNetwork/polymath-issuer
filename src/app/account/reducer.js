// @flow

import * as a from './actions'
import type { Action } from './actions'

export type AccountState = {
  isSignedUp: ?boolean,
}

const defaultState: AccountState = {
  isSignedUp: null,
}

export default (state: AccountState = defaultState, action: Action) => {
  switch (action.type) {
    case a.SIGNED_UP:
      return {
        ...state,
        isSignedUp: action.value,
      }
    default:
      return state
  }
}
