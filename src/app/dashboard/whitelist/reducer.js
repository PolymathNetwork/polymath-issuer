import * as a from './actions'
// import { FakeData } from './fakedata'

const defaultState = {
  //these are used only for displaying the information
  addresses: ["No addresses uploaded"],
  sell: [0],
  buy: [0],

  //fake data is used to display the whole list, so this gets updated by the blockchain events, or the backend, or both 
  investors: [],
  investorsPaginated: [[]],
  listLength: 10,

  csvMessage: "Please upload a CSV file",
  basicMessage: "",
}

export default (state = defaultState, action) => {
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
    case a.GET_WHITELIST:
      return {
        ...state,
        investors: [...state.investors, ...action.investors],
      }
    case a.GET_WHITELIST_FAILED:
      return {
        ...state,
      }
    default:
      return state
  }
}

