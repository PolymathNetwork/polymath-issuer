// @flow

import type { RouterHistory } from 'react-router-dom'
import type { DispatchAPI } from 'redux'

import type { Notify } from './state.types'
import { GetState } from '../../redux/state.types'
import { actionGen } from '../../redux/helpers'
import type { ExtractReturn } from '../../redux/helpers'
import { etherscanTx } from '../helpers'

export const SETUP_HISTORY = 'ui/SETUP_HISTORY'
export const setupHistory = (history: RouterHistory) => ({ type: 'ui/SETUP_HISTORY', history })

export const TX_START = 'ui/TX_START'
export const txStart = (message: string) => ({ type: 'ui/TX_START', message })

export const TX_HASH = 'ui/TX_HASH'
export const txHash = (hash: string) => ({ type: 'ui/TX_HASH', hash })

export const TX_END = 'ui/TX_END'
export const txEnd = (receipt: any) => ({ type: 'ui/TX_END', receipt })

export const TX_FAILED = 'ui/TX_FAILED'
export const _txFailed = () => ({ type: 'ui/TX_FAILED' })

export const FETCHING = 'ui/FETCHING'
export const fetching = (message: string) => ({ type: 'ui/FETCHING', message })

export const FETCHING_FAILED = 'ui/FETCHING_FAILED'
export const _fetchingFailed = () => ({ type: 'ui/FETCHING_FAILED' })

export const FETCHED = 'ui/FETCHED'
export const fetched = () => ({ type: 'ui/FETCHED' })

export const NOTIFY = 'ui/NOTIFY'
export const _notify = (notify: Notify) => ({ type: 'ui/NOTIFY', notify })

export type UIAction =
  | ExtractReturn<typeof setupHistory>
  | ExtractReturn<typeof txStart>
  | ExtractReturn<typeof txHash>
  | ExtractReturn<typeof txEnd>
  | ExtractReturn<typeof _txFailed>
  | ExtractReturn<typeof fetching>
  | ExtractReturn<typeof _fetchingFailed>
  | ExtractReturn<typeof fetched>
  | ExtractReturn<typeof _notify>

// TODO @bshevchenko: write notify body
// eslint-disable-next-line
export const notify = (
  title: string,
  isSuccess: boolean = true,
  subtitle: ?string,
  caption: ?any,
  isPinned: boolean = false,
) => async (dispatch: DispatchAPI<*>) => {
  // eslint-disable-next-line
  console.warn('notify', title, isSuccess ? 'success' : 'error', subtitle, caption, isPinned ? 'pinned' : '')

  dispatch(_notify({
    title,
    isSuccess,
    subtitle,
    caption,
    isPinned,
  }))
}

export const txFailed = (e: Error) => async (dispatch: DispatchAPI<*>, getState: GetState) => {
  // eslint-disable-next-line
  console.error('Transaction failed', e)
  let caption
  let isPinned = false
  if (getState().ui.txReceipt) {
    caption = etherscanTx(getState().ui.txReceipt.transactionHash)
    isPinned = true
  }
  dispatch(notify('Transaction failed', false, e.message, caption, isPinned))
  dispatch(_txFailed())
}

export const fetchingFailed = (e: Error) => async (dispatch: DispatchAPI<*>) => {
  // eslint-disable-next-line
  console.error('Fetching failed', e)
  dispatch(_fetchingFailed())
}
