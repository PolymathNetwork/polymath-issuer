// @flow

import type { RouterHistory } from 'react-router-dom'
import { notify } from 'polymath-ui'

import { etherscanTx } from '../helpers'
import type { GetState } from '../../redux/state.types'
import type { ExtractReturn } from '../../redux/helpers'

export const SETUP_HISTORY = 'ui/SETUP_HISTORY'
export const setupHistory = (history: RouterHistory) => ({ type: 'ui/SETUP_HISTORY', history })

export const TX_START = 'ui/TX_START'
export const txStart = (message: string) => ({ type: 'ui/TX_START', message })

export const TX_HASH = 'ui/TX_HASH'
export const txHash = (hash: string) => ({ type: 'ui/TX_HASH', hash })

export const TX_END = 'ui/TX_END'
export const txEnd = (receipt: any) => ({ type: 'ui/TX_END', receipt })

export const TX_FAILED = 'ui/TX_FAILED'
const txFailedAction = () => ({ type: 'ui/TX_FAILED' })

export const FETCHING = 'ui/FETCHING'
export const fetching = (message: string) => ({ type: 'ui/FETCHING', message })

export const FETCHING_FAILED = 'ui/FETCHING_FAILED'
const fetchingFailedAction = (message: string) => ({ type: 'ui/FETCHING_FAILED', message })

export const FETCHED = 'ui/FETCHED'
export const fetched = () => ({ type: 'ui/FETCHED' })

export type UIAction =
  | ExtractReturn<typeof setupHistory>
  | ExtractReturn<typeof txStart>
  | ExtractReturn<typeof txHash>
  | ExtractReturn<typeof txEnd>
  | ExtractReturn<typeof txFailedAction>
  | ExtractReturn<typeof fetching>
  | ExtractReturn<typeof fetchingFailedAction>
  | ExtractReturn<typeof fetched>

export const txFailed = (e: Error) => async (dispatch: Function, getState: GetState) => {
  // eslint-disable-next-line
  console.error('Transaction failed', e)
  let caption
  let isPinned = false
  if (getState().ui.txReceipt) {
    caption = etherscanTx(getState().ui.txReceipt.transactionHash)
    isPinned = true
  }
  dispatch(notify({
    title: 'Transaction failed',
    isSuccess: false,
    subtitle: e.message,
    caption,
    isPinned,
  }))
  dispatch(txFailedAction())
}

export const fetchingFailed = (e: Error) => async (dispatch: Function) => {
  // eslint-disable-next-line
  console.error('Fetching failed', e)
  dispatch(fetchingFailedAction(e.message))
}
