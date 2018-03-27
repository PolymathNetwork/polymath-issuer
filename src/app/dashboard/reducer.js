// @flow

import * as a from './actions'
import type { DashboardAction } from './actions'
import type { DashboardState } from './state.types'

const defaultState: DashboardState = {
  token: null,
}

export default (state: DashboardState = defaultState, action: DashboardAction) => {
  switch (action.type) {
    case a.TOKEN_DETAILS:
      return {
        ...state,
        token: action.token,
      }
    default:
      return state
  }
}
