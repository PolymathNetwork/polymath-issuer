import * as a from './actions'

const defaultState = {
  history: null,
  isLoading: false,
  loadingMessage: null,
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
    case a.UI_TX_START:
      return {
        ...state,
        isLoading: true,
        loadingMessage: action.message,
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
        txHash: null,
        isLoading: false,
      }
    case a.UI_TX_FAILED:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}
