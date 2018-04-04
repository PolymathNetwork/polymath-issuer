//@flow

import uuidv4 from 'uuid/v4'

import * as ui from 'polymath-ui'
import { TransferManager, SecurityTokenRegistry } from 'polymath.js_v2'
import type { Investor } from 'polymath.js_v2/types'
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
export const SHOW_MODAL_2 = 'dashboard/whitelist/SHOW_MODAL_2'

//same as editing
export const REMOVE_SINGLE_ENTRY = 'dashboard/whitelist/REMOVE_SINGLE_ENTRY'
export const REMOVE_SINGLE_ENTRY_FAILED = 'dashboard/whitelist/REMOVE_SINGLE_ENTRY_FAILED'

export const EXPORT_NEW_LIST = 'dashboard/whitelist/EXPORT_NEW_LIST'
export const EXPORT_NEW_LIST_FAILED = 'dashboard/whitelist/EXPORT_NEW_LIST_FAILED'

export type TableData = {
  id: string,
  address: string,
  addedDate: number,
  addedBy: string,
  sell: number,
  buy: number,
}

//this will need to be used WHEN the token actually exists in the state
//when using sto generator i wont have this
export const fetch = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const token = getState().token.token
    if (!token || !token.contract) {
      return dispatch(ui.fetched())
    }
    //change to reflect WhiteList
    // const sto = await token.contract.getSTO()
    // dispatch(data(sto, sto ? await sto.getDetails() : null))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

//Uploads the CSV file, reads it with built in js FileReader(), dispatches to the store the csv file information,
//which can then be sent to the blockchain with multiUserSumbit()
//QUESTION: @davekaj - Do we need to limit CSV file to 50 or 100, and notify them that it is too long?
export const uploadCSV = (e) => async (dispatch: Function) => {
  let file = e.target.files[0]
  let textType = /csv.*/
  if (file.type.match(textType)) {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function () {
      let parsedData = parseCSV(reader.result)
      dispatch({ type: UPLOAD_CSV, csvMessage: "CSV upload was successful!", addresses: parsedData[0], sell: parsedData[1], buy: parsedData[2] })
      dispatch({ type: SHOW_MODAL_2, modalShowing: true })

    }
  } else {
    dispatch({ type: UPLOAD_CSV_FAILED, csvMessage: "There was an error uploading the CSV file" })
  }
}

//Takes the CSV data, turns it into two arrays, split up by addresses and time they are allowed to trade for , in order
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
export const multiUserSubmit = () => async (dispatch: Function, getState: Function) => {
  let tableData = []
  let blockchainData = []
  let csvAddresses = { ...getState().whitelist.addresses }
  let csvSell = { ...getState().whitelist.sell }
  let csvBuy = { ...getState().whitelist.buy }
  // let account = "TODO!"

  for (let i = 0; i < (Object.keys(csvAddresses)).length; i++) {
    let csvRandomID = uuidv4()
    const owner = "0xdc4d23daf21da6163369940af54e5a1be783497b" //hardcoded temporarily , as i need to link up account from metamask
    let sellTimestamp = Math.round((new Date(csvSell[i])).getTime() / 1000)
    let buyTimestamp = Math.round((new Date(csvBuy[i])).getTime() / 1000)

    let backendData: TableData = {
      id: csvRandomID,
      address: csvAddresses[i],
      addedDate: Math.round((new Date()).getTime() / 1000),
      addedBy: owner,
      sell: sellTimestamp,
      buy: buyTimestamp,
    }
    tableData.push(backendData)

    let investorData: Investor = {
      address: csvAddresses[i],
      addedBy: owner,
      added: Math.round((new Date()).getTime() / 1000),
      from: sellTimestamp,
      to: buyTimestamp,
    }
    blockchainData.push(investorData)
  }
  // console.log(tableData)

  dispatch({ type: ADD_MULTI_ENTRY, investors: tableData })

  //right now it is backwards, it populates the table befroe we even send the transaction. however, we need to be reading from events anyways

  // need to check whether or not this account exists, however at this point in the app the tokenSymbol would probavly actually be in redux state, here i will
  // hard code for now

  // const token = getState().token
  // console.log(token)
  // if (!token || !token.contract) {
  //   return dispatch(ui.fetched())
  // }

  let tokenSymbol = "DAVE"
  // let accounts = await web3.eth.getAccounts()
  // let Issuer = accounts[0]

  dispatch(ui.fetching())
  try {
    const token = await SecurityTokenRegistry.getTokenByTicker(tokenSymbol)
    console.log(token)
    // dispatch(data(token))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }

  dispatch(ui.txStart('Submitting CSV to the blockchain...'))
  try {

    const receipt = await TransferManager.modifyWhitelistMulti(blockchainData)
    dispatch(ui.notify(
      'CSV was successfully uploaded',
      true,
      'We will present the investor list to you on the next page',
      ui.etherscanTx(receipt.transactionHash)
    ))
    dispatch(fetch())

    //dont think this is nneed we will see
    // dispatch({ type: SHOW_MODAL_2, modalShowing: true })

  } catch (e) {

    dispatch(ui.txFailed(e))
  }

  //TODO: @davekaj Then , read events and get all addresses and their information, as arrays
  getWhiteList()
  //  const investors: Array<Investor> = await transferManager.getWhitelist()

}

export const paginationDivider = () => async (dispatch: Function, getState: Function) => {
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
  dispatch({ type: PAGINATION_DIVIDER, paginatedInvestors: holdsDivisons })
}

export const listLength = (e) => async (dispatch: Function) => {
  dispatch({ type: LIST_LENGTH, listLength: e })
}

// export const showModal2 = () => async (dispatch) => {
//   dispatch({ type: SHOW_MODAL_2, modalShowing: true })
// }

//TODO - where is owner coming from?
export const oneUserSubmit = () => async (dispatch: Function, getState: Function) => {
  let randomID = uuidv4()
  const user = { ...getState().form[userFormName].values }
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

export const getWhiteList = () => async (dispatch: Function) => {

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
// export const fetch = () => async (dispatch: Function, getState: GetState) => {
// dispatch(ui.fetching())
// try {
//   const token = getState().token.token
//   if (!token || !token.contract) {
//     return dispatch(ui.fetched())
//   }
//   const sto = await token.contract.getSTO()
//   dispatch(data(sto, sto ? await sto.getDetails() : null))
//   dispatch(ui.fetched())
// } catch (e) {
//   dispatch(ui.fetchingFailed(e))
// }
// }
