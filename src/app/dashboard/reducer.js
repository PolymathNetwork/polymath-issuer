import * as a from './actions'

const defaultState = {
  token: null,
}

export default (state = defaultState, action) => {
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
