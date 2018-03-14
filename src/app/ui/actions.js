import { actionGen } from '../../redux/helpers'

export const UI_SETUP_HISTORY = 'ui/SETUP_HISTORY'
export const UI_TX_START = 'ui/TX_START'
export const UI_TX_HASH = 'ui/TX_HASH'
export const UI_TX_END = 'ui/TX_END'
export const UI_TX_FAILED = 'ui/TX_FAILED'

export const setupHistory = actionGen(UI_SETUP_HISTORY)

// TODO @bshevchenko: write notify body
// eslint-disable-next-line
export const notify = (title: string, isSuccess: boolean = true, subtitle: ?string, caption: ?string) => async () => {
}

export const txStart = (message: string) => ({ type: UI_TX_START, message })
export const txHash = actionGen(UI_TX_HASH)
export const txEnd = actionGen(UI_TX_END)

export const txFailed = (e: Error) => async (dispatch) => {
  // eslint-disable-next-line
  console.error('Transaction failed', e)
  // TODO @bshevchenko: put etherscan link as a caption if there is a tx receipt in state
  dispatch(notify('Transaction failed', false, e.message))
  dispatch({ type: UI_TX_FAILED })
}
