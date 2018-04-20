// @flow

import BigNumber from 'bignumber.js'
import * as a from './actions'
import type { Action } from './actions'

export type AccountState = {
  isSignedUp: ?boolean,
  balance: ?BigNumber,
}

const defaultState: AccountState = {
  isSignedUp: null,
  balance: null,
}

export default (state: AccountState = defaultState, action: Action) => {
  switch (action.type) {
    case a.SIGNED_UP:
      return {
        ...state,
        isSignedUp: action.value,
      }
    case a.BALANCE:
      return {
        ...state,
        balance: action.balance,
      }
    default:
      return state
  }
}
