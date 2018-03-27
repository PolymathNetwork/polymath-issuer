// @flow

import type { RouterHistory } from 'react-router-dom'

export type Notify = {
  title: string,
  isSuccess: boolean,
  subtitle: ?string,
  caption: ?string,
  isPinned: boolean,
}

export type UIState = {
  history: ?RouterHistory,
  isLoading: bool,
  loadingMessage: ?string,
  txHash: ?string,
  txReceipt: any,
  notify: ?Notify,
}
