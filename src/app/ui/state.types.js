// @flow

import type { RouterHistory } from 'react-router-dom'

export type UIState = {
  history: ?RouterHistory,
  isLoading: bool,
  loadingMessage: ?string,
  txHash: ?string,
  txReceipt: any,
}
