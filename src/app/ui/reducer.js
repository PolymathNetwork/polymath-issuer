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
        txHash: '0x8a72b5d3cb39c37030bbbe00e29f30b76ec862bdfe24ff056553a87e0e413396', // TODO @bshevchenko: remove this demo string
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
    default:
      return state
  }
}
