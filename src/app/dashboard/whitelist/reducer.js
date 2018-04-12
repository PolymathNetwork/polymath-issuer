// @flow

import { TransferManager } from 'polymathjs'
import type { Investor } from 'polymathjs/types'

import * as a from './actions'
import type { Action } from './actions'

export type WhitelistState = {
  transferManager: TransferManager,
  addresses: Array<string>,
  sell: Array<number>,
  buy: Array<number>,
  investors: Array<Investor>,
  listLength: number,
  csvMessage: string,
  previewCSVShowing: boolean,
}

const defaultState: WhitelistState = {
  transferManager: null,
  addresses: [],
  sell: [],
  buy: [],
  investors: [{
    address: "No investors added yet!",
    added: new Date(0),
    addedBy: "",
    from: new Date(0),
    to: new Date(0),
  }],
  listLength: 10,
  csvMessage: "Please upload a CSV file",
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
        csvMessage: action.csvMessage,
        previewCSVShowing: action.previewCSVShowing,
      }
    case a.UPLOAD_CSV_FAILED:
      return {
        ...state,
        csvMessage: action.csvMessage,
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
