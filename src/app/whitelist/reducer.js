// @flow

import { TransferManager } from 'polymathjs'
import type { Investor, Address } from 'polymathjs/types'

import * as a from './actions'
import type { Action } from './actions'

export type WhitelistState = {|
  transferManager: TransferManager,
  addresses: Array<Address>,
  sell: Array<number>,
  buy: Array<number>,
  investors: Array<Investor>,
  listLength: number,
  previewCSVShowing: boolean,
|}

const defaultState: WhitelistState = {
  transferManager: null,
  addresses: [],
  sell: [],
  buy: [],
  investors: [],
  listLength: 10,
  previewCSVShowing: false,
}

export default (state: WhitelistState = defaultState, action: Action) => {
  switch (action.type) {
    case a.TRANSFER_MANAGER:
      return {
        ...state,
        transferManager: action.transferManager,
      }
    case a.UPLOAD_CSV:
      return {
        ...state,
        addresses: action.addresses,
        sell: action.sell,
        buy: action.buy,
        previewCSVShowing: action.previewCSVShowing,
      }
    case a.UPLOAD_CSV_FAILED:
      return {
        ...state,
      }
    case a.GET_WHITELIST:
      return {
        ...state,
        investors: [...action.investors],
      }
    case a.LIST_LENGTH:
      return {
        ...state,
        listLength: action.listLength,
      }
    default:
      return state
  }
}
