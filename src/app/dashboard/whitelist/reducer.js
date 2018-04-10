// @flow

import { TransferManager } from 'polymath.js_v2'

import * as a from './actions'
import type { EventData, Action } from './actions'

export type WhitelistState = {
  transferManager: TransferManager,
  addresses: Array<string>,
  sell: Array<number>,
  buy: Array<number>,
  investors: Array<EventData>,
  investorsPaginated: Array<Array<EventData>>,
  listLength: number,
  csvMessage: string,
}

const defaultState: WhitelistState = {
  transferManager: null,
  addresses: [],
  sell: [],
  buy: [],
  investors: [{
    id: "",
    address: "",
    added: 0,
    addedBy: "",
    from: 0,
    to: 0,
  }],
  investorsPaginated: [[]],
  listLength: 10,
  csvMessage: "Please upload a CSV file",
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
        modalShowing: action.modalShowing,
      }
    case a.UPLOAD_CSV_FAILED:
      return {
        ...state,
        csvMessage: action.csvMessage,
      }
    case a.ADD_SINGLE_ENTRY:
      return {
        ...state,
        addresses: action.address,
        sell: action.sell,
        buy: action.buy,
        investors: [...state.investors, action.investors], //this should be removed , only getWhitelist updates investors from events of blockchain,
        //and only pagination updates itself after pulling from investors
      }
    case a.ADD_SINGLE_ENTRY_FAILED:
      return {
        ...state,
        addresses: action.address,
        sell: action.sell,
        buy: action.buy,
      }
    case a.GET_WHITELIST:
      return {
        ...state,
        investors: [...action.investors],
      }
    case a.PAGINATION_DIVIDER:
      return {
        ...state,
        investorsPaginated: action.paginatedInvestors,
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
