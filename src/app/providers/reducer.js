// @flow

import * as a from './actions'
import type { ServiceProvider } from './data'

export type ProvidersState = {
  data: ?Array<ServiceProvider>,
}

const defaultState: ProvidersState = {
  data: null,
}

export default (state: ProvidersState = defaultState, action: Object) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        data: action.providers,
      }
    default:
      return state
  }
}
