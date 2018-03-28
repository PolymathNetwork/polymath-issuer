import uuidv4 from 'uuid/v4'

// import { PolyToken } from 'polymath.js_v2' //TODO: @davekaj update to the actual polymathjs when it is ready
import * as ui from '../../ui/actions'
// import { etherscanTx } from '../helpers'
// import { actionGen } from "../../../redux/helpers"
import { formName as userFormName } from './userForm'

export const UPLOAD_CSV = 'dashboard/whitelist/UPLOAD_CSV'
export const UPLOAD_CSV_FAILED = 'dashboard/whitelist/UPLOAD_CSV_FAILED'

export const ADD_MULTI_ENTRY = 'dashboard/whitelist/ADD_MULTI_ENTRY'
export const ADD_MULTI_ENTRY_FAILED = 'dashboard/whitelist/ADD_MULTI_ENTRY_FAILED'

export const ADD_SINGLE_ENTRY = 'dashboard/whitelist/ADD_SINGLE_ENTRY'
export const ADD_SINGLE_ENTRY_FAILED = 'dashboard/whitelist/ADD_SINGLE_ENTRY_FAILED'

export const GET_WHITELIST = 'dashboard/whitelist/ADD_SINGLE_ENTRY'
export const GET_WHITELIST_FAILED = 'dashboard/whitelist/ADD_SINGLE_ENTRY_FAILED'

export const PAGINATION_DIVIDER = 'dashboard/whitelist/PAGINATION_DIVDER'
export const LIST_LENGTH = 'dashboard/whitelist/LIST_LENGTH'

//same as editing
export const REMOVE_SINGLE_ENTRY = 'dashboard/whitelist/REMOVE_SINGLE_ENTRY'
export const REMOVE_SINGLE_ENTRY_FAILED = 'dashboard/whitelist/REMOVE_SINGLE_ENTRY_FAILED'

export const EXPORT_NEW_LIST = 'dashboard/whitelist/EXPORT_NEW_LIST'
export const EXPORT_NEW_LIST_FAILED = 'dashboard/whitelist/EXPORT_NEW_LIST_FAILED'

//Uploads the CSV file, reads it with built in js FileReader(), dispatches to the store the csv file information,
//which can then be sent to the blockchain with multiUserSumbit()
//QUESTION: @davekaj - Do we need to limit CSV file to 50 or 100, and notify them that it is too long?
export const uploadCSV = (e) => async (dispatch) => {
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
const parseCSV = (csvResult) => {
  let parsedData = []
  let addresses = []
  let sellRestriction = []
  let buyRestriction = []
  let allTextLines = csvResult.split(/\r\n|\n/)
  let zeroX = "0x"

  for (let i = 0; i < allTextLines.length; i++) {
    let entry = allTextLines[i]
    if (entry.includes(zeroX)) {
      let splitArray = entry.split(",", 4)

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

//This takes the CSV data we have stored in the store from uploadCSV, and then submits it to the blockchain
export const multiUserSubmit = () => async (dispatch, getState) => {
  let tableData = []
  let csvAddresses = { ...getState().whitelist.addresses }
  let csvSell = { ...getState().whitelist.sell }
  let csvBuy = { ...getState().whitelist.buy }
  // let account = "TODO!"

  for (let i = 0; i < (Object.keys(csvAddresses)).length; i++) {
    let csvRandomID = uuidv4()
    const owner = "0xdc4d23daf21da6163369940af54e5a1be783497b" //hardcoded temporarily , as i need to link up account from metamask
    let sellTimestamp = Math.round((new Date(csvSell[i])).getTime() / 1000)
    let buyTimestamp = Math.round((new Date(csvBuy[i])).getTime() / 1000)

    let backendData = {
      id: csvRandomID,
      address: csvAddresses[i],
      addedDate: Math.round((new Date()).getTime() / 1000),
      addedBy: owner,
      sell: sellTimestamp,
      buy: buyTimestamp,
    }
    tableData.push(backendData)
  }
  // console.log(tableData)

  dispatch({ type: ADD_MULTI_ENTRY, investors: tableData })

  //below is the call to the blockchain , above is the store updating 
  try {
    // const isPreAuth = false
    // if (!isPreAuth) {

    //temp commented out
    // dispatch(ui.txStart('Sending the CSV information to the blockchain'))

    // await PolyToken.methods.modifyWhitelistMulti(csvAddresses, csvSell, csvBuy)
    //   .send({
    //     from: account, //TODO: @davekaj get account
    //     gas: gasEstimate, //TODO: @davekaj code up gasEstimate (will be high if big array)
    //   })
    //  }

    //then call into the blockchain to verify if the transaction worked, check if an investors time is good
    //const receipt = await.PolyToken.methods. --- need to check here something that will verify
    //then notify, if success (failure is in teh catch)
    // dispatch(ui.notify(
    //   'csv uploaded to blockcahin'
    //   true,
    //   'Please now see the whitelist uploaded to the app',
    //   etherscanTx(receipt.transactionHash)
    // ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }

  //TODO: @davekaj Then , read events and get all addresses and their information, as arrays 
  getWhiteList()

}

export const paginationDivider = () => async (dispatch, getState) => {
  const fullInvestorList = [...getState().whitelist.investors]
  let holdsDivisons = []
  let singlePage = []
  let listLength = getState().whitelist.listLength
  
  for (let i = 0; i < fullInvestorList.length; i++) {

    singlePage.push(fullInvestorList[i])
    if (singlePage.length === listLength || i === (fullInvestorList.length - 1)) {

      holdsDivisons.push(singlePage)
      singlePage = []
    }
  }
  // console.log(holdsDivisons)
  dispatch({ type: PAGINATION_DIVIDER, paginatedInvestors: holdsDivisons })

}

export const listLength = (e) => async (dispatch, getState) => {
  dispatch({ type: LIST_LENGTH, listLength: e })
}

//TODO - where is owner coming from?
export const oneUserSubmit = () => async (dispatch, getState) => {

  let randomID = uuidv4()

  const user = { ...getState().form[userFormName].values }
  // console.log(user)
  const owner = "0xdc4d23daf21da6163369940af54e5a1be783497b" //hardcoded temporarily , as i need to link up account from metamask
  let sellTimestamp = Math.round((new Date(user.sell)).getTime() / 1000)
  let buyTimestamp = Math.round((new Date(user.buy)).getTime() / 1000)

  let backendData = {
    id: randomID,
    address: user.address,
    addedDate: Math.round((new Date()).getTime() / 1000),
    addedBy: owner,
    sell: sellTimestamp,
    buy: buyTimestamp,
  }

  //below is the call to the blockchain , above is the store updating 
  try {
    // const isPreAuth = false
    // if (!isPreAuth) {

    //COMMENTED OUT TEMPORARILY
    //dispatch(ui.txStart('Sending the Single user information to the blockchain'))

    // await PolyToken.methods.modifyWhitelist(csvAddresses, csvSell, csvBuy)
    //   .send({
    //     from: account, //TODO: @davekaj get account
    //     gas: gasEstimate, //TODO: @davekaj code up gasEstimate (will be high if big array)
    //   })
    // // }

    //then call into the blockchain to verify if the transaction worked, check if an investors time is good
    //const receipt = await.PolyToken.methods. --- need to check here something that will verify
    //then notify, if success (failure is in teh catch)
    // dispatch(ui.notify(
    //   'csv uploaded to blockcahin'
    //   true,
    //   'Please now see the whitelist uploaded to the app',
    //   etherscanTx(receipt.transactionHash)
    // ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }

  // getWhiteList()

  //these will actually get deleted or changed complete, becasue we shouldnt be sending to the store direcrly from the app. 
  //we need to go user input ---> blockchain ---> events ---> getWhitelist grabs events ----> populates our store
  // at which point we need to change time stamps to human readable dates
  if (true) {
    dispatch({ type: ADD_SINGLE_ENTRY, basicMessage: "Sent to Polymath Contracts", investors: backendData })
  } else {
    dispatch({ type: ADD_SINGLE_ENTRY_FAILED, basicMessage: "There was an error in the data you tried to send to the Polymath Contracts" })
  }

}

export const getWhiteList = () => async (dispatch, getState) => {

// let testing = true
// console.log("truck")

// //temporarily have this fake data?

// if (testing) {
//   console.log("truck")
//   // dispatch({ type: GET_WHITELIST, basicMessage: "Whitelist retrived from blockchain logs", investors: backendData })

// } else {
//   // let whitelist = await transferManager.getWhitelist() //-will look ike this, need to write poyljs
//   console.log("truck")

//   //for now we just get state in store, which we originally put up with timestamps, and now we will conver to human
//   //readable dates to mimic when we pull from events

//   let dummyState = { ...getState().whitelist.investors } 

//   console.log(dummyState)

//   // dispatch({ type: GET_WHITELIST, basicMessage: "Whitelist retrived from blockchain logs", investors: backendData })
//   // dispatch({ type: GET_WHITELIST_FAILED, csvMessage: "There was an error grabbing the whitelist" })
// }

}

//TODO: @dave - implement the Investor type, as briefly described below

// type Investor = {
//   address: string,
//   from: Date,
//   to: Date
// }
// const investor: Investor = { address, from, to }
// await transferManager.modifyWhitelist(investor)

// const investors: Array<Investor>
// await transferManager.modifyWhitelist(investors)
// const investors: Array<Investor> = await transferManager.getWhitelist()
