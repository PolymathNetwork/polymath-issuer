// @flow

import { TransferManager } from 'polymathjs'
import type { Investor } from 'polymathjs/types'

import * as a from './actions'
import type { InvestorCSVRow } from './actions'

export type WhitelistState = {|
  transferManager: TransferManager,
  investors: Array<Investor>,
  uploaded: Array<Investor>,
  criticals: Array<InvestorCSVRow>,
  isTooMany: boolean,
  listLength: number,
|}

const defaultState: WhitelistState = {
  transferManager: null,
  investors: [],
  uploaded: [],
  criticals: [],
  isTooMany: false,
  listLength: 10,
}

export default (state: WhitelistState = defaultState, action: Object) => {
  switch (action.type) {
    case a.TRANSFER_MANAGER:
      return {
        ...state,
        transferManager: action.transferManager,
      }
    case a.LIST_LENGTH:
      return {
        ...state,
        listLength: action.listLength,
      }
    case a.WHITELIST:
      return {
        ...state,
        investors: [...action.investors],
      }
    case a.UPLOADED:
      return {
        ...state,
        uploaded: action.investors,
        criticals: action.criticals,
        isTooMany: action.isTooMany,
      }
    case a.RESET_UPLOADED:
      return {
        ...state,
        uploaded: [],
        criticals: [],
        isTooMany: false,
      }
    default:
      return state
  }
}
