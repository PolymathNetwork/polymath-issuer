import { actionGen } from '../../redux/helpers'
import { etherscanTx } from '../helpers'

export const SETUP_HISTORY = 'ui/SETUP_HISTORY'
export const TX_START = 'ui/TX_START'
export const TX_HASH = 'ui/TX_HASH'
export const TX_END = 'ui/TX_END'
export const TX_FAILED = 'ui/TX_FAILED'
export const FETCHING = 'ui/FETCHING'
export const FETCHING_FAILED = 'ui/FETCHING_FAILED'
export const FETCHED = 'ui/FETCHED'

export const setupHistory = actionGen(SETUP_HISTORY)
export const fetching = (message: string) => ({ type: FETCHING, message })
export const fetched = actionGen(FETCHED)
export const txStart = (message: string) => ({ type: TX_START, message })
export const txHash = actionGen(TX_HASH)
export const txEnd = actionGen(TX_END)

// TODO @bshevchenko: write notify body
// eslint-disable-next-line
export const notify = (
  title: string,
  isSuccess: boolean = true,
  subtitle: ?string,
  caption: ?any,
  isPinned: boolean = false,
) => async () => {
  // eslint-disable-next-line
  console.warn('notify', title, isSuccess ? 'success' : 'error', subtitle, caption, isPinned ? 'pinned' : '')
}

export const txFailed = (e: Error) => async (dispatch, getState) => {
  // eslint-disable-next-line
  console.error('Transaction failed', e)
  let caption
  let isPinned = false
  if (getState().ui.txReceipt) {
    caption = etherscanTx(getState().ui.txReceipt.transactionHash)
    isPinned = true
  }
  dispatch(notify('Transaction failed', false, e.message, caption, isPinned))
  dispatch({ type: TX_FAILED })
}

export const fetchingFailed = (e: Error) => async (dispatch) => {
  // eslint-disable-next-line
  console.error('Fetching failed', e)
  dispatch({ type: FETCHING_FAILED })
}
