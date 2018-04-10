//@flow

import uuidv4 from 'uuid/v4'
import * as ui from 'polymath-ui'
import { TransferManager, SecurityToken } from 'polymath.js_v2'
import type { Investor } from 'polymath.js_v2/types'
import { formName as userFormName } from './userForm'
import type { GetState } from '../../../redux/reducer'
import type { ExtractReturn } from '../../../redux/helpers'

export const TRANSFER_MANAGER = 'dashboard/whitelist/TRANSFER_MANAGER'
export const transferManagerDispatch = (transferManager: TransferManager) => ({ type: TRANSFER_MANAGER, transferManager: transferManager })

export const UPLOAD_CSV = 'dashboard/whitelist/UPLOAD_CSV'
export const csvDispatch = (csvMessage: string, addresses: Array<string>, sell: Array<string>, buy: Array<string>, modalShowing: boolean, ) => ({ type: UPLOAD_CSV, csvMessage, addresses, sell, buy, modalShowing })

export const UPLOAD_CSV_FAILED = 'dashboard/whitelist/UPLOAD_CSV_FAILED'

//this needs to be renamed , cuz it is not actually from csv multi entry, this is from getWhiteList . this has to do with all whitelist grabbing
export const GET_WHITELIST = 'dashboard/whitelist/GET_WHITELIST'
export const getWhitelistDispatch = (investors: Array<EventData>) => ({ type: GET_WHITELIST, investors })

export const GET_WHITELIST_FAILED = 'dashboard/whitelist/GET_WHITELIST_FAILED'

export const PAGINATION_DIVIDER = 'dashboard/whitelist/PAGINATION_DIVDER'
export const paginationDispatch = (paginatedInvestors: Array<Array<EventData>>) => ({ type: PAGINATION_DIVIDER, paginatedInvestors })

export const LIST_LENGTH = 'dashboard/whitelist/LIST_LENGTH'
export const listLengthDispatch = (listLength: number) => ({ type: PAGINATION_DIVIDER, listLength })

export const ADD_SINGLE_ENTRY = 'dashboard/whitelist/ADD_SINGLE_ENTRY'
export const ADD_SINGLE_ENTRY_FAILED = 'dashboard/whitelist/ADD_SINGLE_ENTRY_FAILED'

export type Action =
  | ExtractReturn<typeof transferManagerDispatch>
  | ExtractReturn<typeof csvDispatch>
  | ExtractReturn<typeof getWhitelistDispatch>
  | ExtractReturn<typeof paginationDispatch>
  | ExtractReturn<typeof listLengthDispatch>

export type EventData = {
  id: string,
  address: string,
  added: number,
  addedBy: string,
  from: number,
  to: number,
}

//initialize grabs transferManager , and stores it in state for other functions to easily call
//It then calls getWhiteList() to populate the table for the user
export const initialize = () => async (dispatch: Function, getState: GetState) => {
  const token = getState().token.token
  if (!token || !token.contract) {
    return
  }
  const contract: SecurityToken = token.contract
  const transferManager: TransferManager = await contract.getTransferManager()
  dispatch(transferManagerDispatch(transferManager))
  dispatch(getWhitelist())
}

//Uploads the CSV file, reads it with built in js FileReader(), dispatches to the store the csv file information,
//which can then be sent to the blockchain with multiUserSumbit()
//QUESTION: @davekaj - Do we need to limit CSV file to 50 or 100, and notify them that it is too long? also keep in mind gas limit and WS packet size
export const uploadCSV = (e: Object) => async (dispatch: Function) => {
  let file = e.target.files[0]
  let textType = /csv.*/
  if (file.type.match(textType)) {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function () {
      let parsedData = parseCSV(((reader.result: any): string))
      dispatch(csvDispatch("CSV upload was successful!", parsedData[0], parsedData[1], parsedData[2], true))
    }
  } else {
    dispatch({ type: UPLOAD_CSV_FAILED, csvMessage: "There was an error uploading the CSV file" })
  }
}

//Takes the CSV data, turns it into two arrays, split up by addresses and time they are allowed to trade for , in order
const parseCSV = (csvResult: string ) => {
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
export const multiUserSubmit = () => async (dispatch: Function, getState: GetState) => {
  let blockchainData = []
  let csvAddresses = getState().whitelist.addresses
  let csvSell = getState().whitelist.sell
  let csvBuy = getState().whitelist.buy

  for (let i = 0; i < csvAddresses.length; i++) {
    const owner = "0xdc4d23daf21da6163369940af54e5a1be783497b" //TODO: hardcoded temporarily , as i need to link up account from metamask
    let newSellDate = new Date(csvSell[i])
    let newBuyDate = new Date(csvBuy[i])
    let nowTime = new Date()

    let investorData: Investor = {
      address: csvAddresses[i],
      addedBy: owner,
      added: nowTime, //NOTE: this doesnt actually get used in solidity . added is produced by 'now' from solidity code. but right now, the investor type requires this value
      from: newSellDate,
      to: newBuyDate,
    }
    blockchainData.push(investorData)
  }

  const transferManager = getState().whitelist.transferManager
  dispatch(ui.txStart('Submitting CSV to the blockchain...'))
  try {
    const receipt = await transferManager.modifyWhitelistMulti(blockchainData)
    dispatch(ui.notify(
      'CSV was successfully uploaded',
      true,
      'We will present the investor list to you on the next page',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  // dispatch(getWhitelist()) TODO: this right now is returning the list PLUS the list, so 14 + 4 = 18 ends up being 14 + 18 = 36
}

//TODO - where is owner coming from?
export const oneUserSubmit = () => async (dispatch: Function, getState: GetState) => {
  const user = { ...getState().form[userFormName].values }
  const owner = "0xdc4d23daf21da6163369940af54e5a1be783497b" //hardcoded temporarily , as i need to link up account from metamask
  let newSellDate = new Date(user.sell)
  let newBuyDate = new Date(user.buy)
  let nowTime = new Date()

  let blockchainData: Investor = {
    address: user.address,
    addedBy: owner,
    added: nowTime,
    from: newSellDate,
    to: newBuyDate,
  }

  const transferManager = getState().whitelist.transferManager
  dispatch(ui.txStart('Submitting CSV to the blockchain...'))
  try {
    const receipt = await transferManager.modifyWhitelist(blockchainData)
    dispatch(ui.notify(
      'CSV was successfully uploaded',
      true,
      'We will present the investor list to you on the next page',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  // dispatch(getWhitelist()) TODO: this right now is returning the list PLUS the list, so 14 + 4 = 18 ends up being 14 + 18 = 36

}

export const getWhitelist = (calenderStart?: Date, calenderEnd?: Date) => async (dispatch: Function, getState: GetState) => {
  let tableData = []

  const transferManager = getState().whitelist.transferManager
  let whitelistEvents = await transferManager.getWhitelist()

  //if statement only gets checked if both date picker values have been filled in, and then it will shrink the list down to its needed size
  if (calenderStart !== undefined && calenderEnd !== undefined) {
    let wlDateRestricted = []
    for (let k =0; k < whitelistEvents.length; k++){
      if (calenderStart.getTime() < whitelistEvents[k].added.getTime() && whitelistEvents[k].added.getTime()  < calenderEnd.getTime() ){
        wlDateRestricted.push(whitelistEvents[k])
      }
    }
    whitelistEvents = wlDateRestricted

  }
  console.log(whitelistEvents)
  //yenno, going through this array backwards would probably save some computation time
  for (let i =0; i < whitelistEvents.length; i++){
    let csvRandomID = uuidv4()
    let fromTime = (whitelistEvents[i].from).toDateString()
    let toTime = (whitelistEvents[i].to).toDateString()
    // let addedTime = (whitelistEvents[i].added).toDateString() this is not needed because we still need it in date format 

    //TODO: consider edge cases, like when someone uploads updates in the same day. This may have to do with polymath.js, being able to return down to the second, not just day
    //in order to fix this, we need to keep the time accurate throughout to the second, and then do toDateString when you throw away the zero values
    let found = tableData.some(function (el, index, array) {
      //if true, User already recorded in eventList, so we don't want to make a new entry
      if( el.address === whitelistEvents[i].address ){
        // if true, this event is newer than the previous event, so we update the space in the array
        // console.log(whitelistEvents[i].added)
        // console.log(el.added)
        if (whitelistEvents[i].added > el.added){
          // console.log(whitelistEvents[i].added > el.added)
          // console.log("fucka")
          let updateArray: EventData = {
            id: csvRandomID,
            address: whitelistEvents[i].address,
            added: whitelistEvents[i].added,
            addedBy: whitelistEvents[i].addedBy,
            from: fromTime,
            to: toTime,
          }
          array[index] = updateArray
          return true
        }else {
          return true
        }
        //found returns false because it doesn't exist. so we add it below as backendData
      } else {
        return false
      }
    })
    if (!found) {
      let backendData: EventData = {
        id: csvRandomID,
        address: whitelistEvents[i].address,
        added: whitelistEvents[i].added,
        addedBy: whitelistEvents[i].addedBy,
        from: fromTime,
        to: toTime,
      }
      tableData.push(backendData)
    }
  }

  /////////////////set back to string & get rid of zero values  START

  console.log(tableData)

  let cleanArray = []
  for (let j = 0; j < tableData.length; j++){

    let cleanInvestor: EventData = {
      id: tableData[j].id,
      address: tableData[j].address,
      added: (tableData[j].added).toDateString(),
      addedBy: tableData[j].addedBy,
      from: tableData[j].from,
      to: tableData[j].to,
    }
    cleanArray.push(cleanInvestor)
  }
  console.log(cleanArray)
  /////////////////set back to string & get rid of zero values  END

  dispatch(getWhitelistDispatch(cleanArray))
  dispatch(paginationDivider())
}

export const paginationDivider = () => async (dispatch: Function, getState: GetState) => {
  const fullInvestorList = [...getState().whitelist.investors]
  console.log(fullInvestorList)
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
  if (holdsDivisons.length === 0 ) {
    const noMatch: EventData = {
      id: "nomatch",
      address: "No investors exist for these dates",
      added: null,
      addedBy: null,
      from: null,
      to: null,
    }
    holdsDivisons.push([noMatch])

  }
  dispatch(paginationDispatch(holdsDivisons))
}

export const listLength = (e: number) => async (dispatch: Function) => {
  dispatch(listLengthDispatch(e))
}

//NOTE: this function only allows complete removal of both sell and buy times. do we need customization to do only single? if so, UI is not showing like this
//TODO: need to make a function in polymathJS that allows us to remove by just passing a single address, i dont need to do all this on front end, and it doesnt work well from requiring date objects
export const removeInvestor = (addresses) => async (dispatch: Function, getState: GetState) => {
  let blockchainData: Array<Investor> = []
  for (let i = 0; i < addresses.length; i++) {
    const owner = "0xdc4d23daf21da6163369940af54e5a1be783497b" //TODO: hardcoded temporarily , as i need to link up account from metamask
    let removeInvestorTime =  new Date('January 1, 1970 00:00:00')
    console.log(removeInvestorTime)
    // let newTime = removeInvestorTime.getTime()
    // console.log(newTime)
    let nowTime = new Date()

    let removeInvestor: Investor = {
      address: addresses[i],
      addedBy: owner,
      added: nowTime, //NOTE: this doesnt actually get used in solidity . added is produced by 'now' from solidity code. but right now, the investor type requires this value
      from: removeInvestorTime,
      to: removeInvestorTime,
    }
    blockchainData.push(removeInvestor)
  }
  // console.log(blockchainData)
  const transferManager = getState().whitelist.transferManager
  dispatch(ui.txStart('Submitting CSV to the blockchain...'))
  try {
    const receipt = await transferManager.modifyWhitelistMulti(blockchainData)
    dispatch(ui.notify(
      'Investors Removed Successfully',
      true,
      'We will present the investor list to you on the next page',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  // dispatch(getWhitelist()) TODO: this right now is returning the list PLUS the list, so 14 + 4 = 18 ends up being 14 + 18 = 36

}
