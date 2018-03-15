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
    case a.SETUP_HISTORY:
      return {
        ...state,
        history: action.history,
      }
    case a.TX_START:
    case a.FETCHING:
      return {
        ...state,
        isLoading: true,
        txReceipt: null,
        loadingMessage: action.message,
      }
    case a.TX_HASH:
      return {
        ...state,
        txHash: action.hash,
      }
    case a.TX_END:
      return {
        ...state,
        txReceipt: action.receipt,
        txHash: null,
        isLoading: false,
      }
    case a.TX_FAILED:
    case a.FETCHING_FAILED:
    case a.FETCHED:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}
