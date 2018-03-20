import { PolyToken } from 'polymath.js_v2' //TODO: @davekaj update to the actual polymathjs when it is ready
// import * as ui from '../ui/actions'
// import { etherscanTx } from '../helpers'
import { actionGen } from "../../../redux/helpers"

export const TOKEN_DETAILS = 'dashboard/TOKEN'

export const UPLOAD_CSV = 'dashboard/whitelist/UPLOAD_CSV'
export const UPLOAD_CSV_FAILED = 'dashboard/whitelist/UPLOAD_CSV_FAILED'

export const ADD_SINGLE_ENTRY = 'dashboard/whitelist/ADD_SINGLE_ENTRY'
export const ADD_SINGLE_ENTRY_FAILED = 'dashboard/whitelist/ADD_SINGLE_ENTRY_FAILED'

export const REMOVE_SINGLE_ENTRY = 'dashboard/whitelist/REMOVE_SINGLE_ENTRY'
export const REMOVE_SINGLE_ENTRY_FAILED = 'dashboard/whitelist/REMOVE_SINGLE_ENTRY_FAILED'

export const EXPORT_NEW_LIST = 'dashboard/whitelist/EXPORT_NEW_LIST'
export const EXPORT_NEW_LIST_FAILED = 'dashboard/whitelist/EXPORT_NEW_LIST_FAILED'

//Uploads the CSV file, reads it with built in js FileReader(), dispatches to the store the csv file information, which can then be sent to the blockchain
//QUESTION: @davekaj - Do we need to limit CSV file to 50 or 100, and notify them that it is too long?
export const uploadCSV = (e) => async (dispatch) =>  {
  let file = e.target.files[0]
  let textType = /csv.*/
  if (file.type.match(textType)) {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function () {
      let parsedData = parseCSV(reader.result)
      // console.log(parsedData)
      dispatch({ type: UPLOAD_CSV, csvMessage: "CSV upload was successful!", addresses: parsedData[0], sell: parsedData[1], buy: parsedData[2], modalShowing: true })
    }
  } else {
    dispatch({ type: UPLOAD_CSV_FAILED, csvMessage: "There was an error uploading the CSV file" })
  }

}

//Takes the CSV data, turns it into two arrays, split up by addresses and time they are allowed to trade for , in order
//TODO: @davekaj - update it so it has both selling and buying times parsed 
const parseCSV = (csvResult) =>  {
  let parsedData = []
  let addresses = []
  let sellRestriction = []
  let buyRestriction = []

  let allTextLines = csvResult.split(/\r\n|\n/)
  // console.log(allTextLines)

  let zeroX = "0x"

  for (let i = 0; i < allTextLines.length; i++) {
    let entry = allTextLines[i]
    if (entry.includes(zeroX)) {
      let splitArray = entry.split(",", 4)
      // console.log(splitArray)
      //splitArray[0] is ignored, because it is just a blank string. 
      let address = splitArray[1]
      let sell = splitArray[2]
      let buy = splitArray[3]

      addresses.push(address)
      sellRestriction.push(sell)
      buyRestriction.push(buy)

    }
  }
  parsedData.push(addresses)
  parsedData.push(sellRestriction)
  parsedData.push(buyRestriction)

  return parsedData
}

//Update gives the ability to update time on a user for trading and buying. This is the same function to delete/remove of a user, because this is
//done by calling the same function, except instead of giving a unix timestamp of 1511000000 or something, we pass it 0 in the smart contract, meaning they cant trade
// export const updateSelectedInvestors = (e) => async (dispatch) =>  {
//   console.log("update selected investors connect made", e, dispatch)
// }

export const updateSelectedInvestors = () => async () =>  {
}

export const submit = actionGen('submitCSV')

//functionality to send a tx of all the properly organized csv data to the blockchain
export const submitCSV = (addressArray, sellTimeArray, buyTimeArray) => async (dispatch) => {
  await PolyToken.methods.modifyWhitelist(addressArray, sellTimeArray, buyTimeArray)
    .send({
      // from: account //TODO: @davekaj get account
      // gas: gasEstimate //TODO: @davekaj code up gasEstimate (will be high if big array)
    })

    //TODO: @davekaj Then , read events and get all addresses and their information, as arrays 

  let allAddresses
  let allSellTime
  let allBuyTime

  dispatch(
    submit(
      {
        addresses: allAddresses,
        sell: allSellTime,
        buy: allBuyTime,
      }
    )
  )
}
