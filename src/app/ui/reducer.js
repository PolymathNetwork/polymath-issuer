import * as a from './actions'

const defaultState = {
  history: null,
  txHash: null,
  txReceipt: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case a.UI_SETUP_HISTORY:
      return {
        ...state,
        history: action.history,
      }
    case a.UI_TX_HASH:
      return {
        ...state,
        txHash: action.hash,
      }
    case a.UI_TX_END:
      return {
        ...state,
        txReceipt: action.receipt,
      }
    default:
      return state
  }
}
