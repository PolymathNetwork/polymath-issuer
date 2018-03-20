import * as a from './actions'
import { FakeData } from './fakedata'

const defaultState = {
  addresses: ["No addresses uploaded"],
  sell: [0],
  buy: [0],
  fakedata: FakeData,
  csvMessage: "Please upload a CSV file",
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
    default:
      return state
  }
}
