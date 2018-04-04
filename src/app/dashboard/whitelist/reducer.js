// @flow

import * as a from './actions'
import type { EventData } from './actions'
import type { Action } from './actions'

export type WhiteListState = {
  addresses: Array<string>,
  sell: Array<number>,
  buy: Array<number>,
  investors: Array<EventData>,
  investorsPaginated: Array<Array<EventData>>,
  listLength: number,
  csvMessage: string,
}

const defaultState: WhiteListState = {
  addresses: ["No addresses uploaded"],
  sell: [],
  buy: [],
  investors: [],
  investorsPaginated: [[]],
  listLength: 10,
  csvMessage: "Please upload a CSV file",
}

export default (state: WhiteListState = defaultState, action: Action) => {
  switch (action.type) {
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
        investors: [...state.investors, action.investors],
      }
    case a.ADD_SINGLE_ENTRY_FAILED:
      return {
        ...state,
        addresses: action.address,
        sell: action.sell,
        buy: action.buy,
      }
    case a.ADD_MULTI_ENTRY:
      return {
        ...state,
        investors: [...state.investors, ...action.investors],
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
    case a.SHOW_MODAL_2:
      return {
        ...state,
        modalShowing: action.modalShowing,
      }
    // case a.GET_WHITELIST:
    //   return {
    //     ...state,
    //     investors: [...state.investors, ...action.investors],
    //   }
    // case a.GET_WHITELIST_FAILED:
    //   return {
    //     ...state,
    //   }
    default:
      return state
  }
}
