//@flow

import * as ui from 'polymath-ui'
import { TransferManager, SecurityToken } from 'polymathjs'
import type { Investor, Address } from 'polymathjs/types'

import { formName as addInvestorFormName } from './components/addInvestorForm'
import { formName as editInvestorsFormName } from './components/editInvestorsForm'
import type { GetState } from '../../../redux/reducer'
import type { ExtractReturn } from '../../../redux/helpers'

//ac_ = actionCreator
export const TRANSFER_MANAGER = 'dashboard/whitelist/TRANSFER_MANAGER'
export const ac_transferManager = (transferManager: TransferManager) => ({ type: TRANSFER_MANAGER, transferManager })

export const UPLOAD_CSV = 'dashboard/whitelist/UPLOAD_CSV'
export const ac_csvUpload = (csvMessage: string, addresses: Array<Address>, sell: Array<Address>, buy: Array<Address>, previewCSVShowing: boolean, ) =>
  ({ type: UPLOAD_CSV, csvMessage, addresses, sell, buy, previewCSVShowing })
export const UPLOAD_CSV_FAILED = 'dashboard/whitelist/UPLOAD_CSV_FAILED'

export const GET_WHITELIST = 'dashboard/whitelist/GET_WHITELIST'
export const ac_getWhitelist = (investors: Array<Investor>) => ({ type: GET_WHITELIST, investors })
// export const GET_WHITELIST_FAILED = 'dashboard/whitelist/GET_WHITELIST_FAILED'

export const LIST_LENGTH = 'dashboard/whitelist/LIST_LENGTH'
export const ac_listLength = (listLength: number) => ({ type: LIST_LENGTH, listLength })

export type Action =
  | ExtractReturn<typeof ac_transferManager>
  | ExtractReturn<typeof ac_csvUpload>
  | ExtractReturn<typeof ac_getWhitelist>
  | ExtractReturn<typeof ac_listLength>

//initialize grabs transferManager , and stores it in state for other functions to easily call
//It then calls getWhiteList() to populate the table for the user
export const initialize = () => async (dispatch: Function, getState: GetState) => {
  const token = getState().token.token
  if (!token || !token.contract) {
    //eslint-disable-next-line
    return
  }
  const contract: SecurityToken = token.contract
  const transferManager: TransferManager = await contract.getTransferManager()
  dispatch(ac_transferManager(transferManager))
  dispatch(getWhitelist())
}

// Uploads the CSV file, reads it with built in js FileReader(), dispatches to the store the csv file information,
// which can then be sent to the blockchain with multiUserSumbit()

// Note: We just Object type, instead of File type, because here we get passed a File directly from the dropzone, and an event
// from the upload button, and then we determine whether it is a file or not inside of uploadCSV()

// TODO: @davekaj - Do we need to limit CSV file to 50 or 100, and notify them that it is too long? also keep in mind gas limit and WS packet size
export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  let parseFile
  if (file.target === undefined) {
    parseFile = file
  } else {
    parseFile = file.target.files[0]
  }
  let textType = /csv.*/
  if (parseFile.type.match(textType)) {
    let reader = new FileReader()
    reader.readAsText(parseFile)
    reader.onload = function () {
      let parsedData = parseCSV(((reader.result: any): string))
      dispatch(ac_csvUpload('CSV upload was successful!', parsedData[0], parsedData[1], parsedData[2], true))
    }
  } else {
    dispatch({ type: UPLOAD_CSV_FAILED, csvMessage: 'There was an error uploading the CSV file' })
  }
}

//Takes the CSV data, turns it into two arrays, split up by addresses and time they are allowed to trade for , in order
const parseCSV = (csvResult: string ) => {
  let parsedData = []
  let addresses = []
  let sellRestriction = []
  let buyRestriction = []
  let allTextLines = csvResult.split(/\r\n|\n/)
  let zeroX = '0x'
  for (let i = 0; i < allTextLines.length; i++) {
    let entry = allTextLines[i]
    if (entry.includes(zeroX)) {
      let splitArray = entry.split(',', 4)
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
    let newSellDate = new Date(csvSell[i])
    let newBuyDate = new Date(csvBuy[i])
    let investorData: Investor = {
      address: csvAddresses[i],
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
      'Investors from the CSV were successfully sent to the blockchain',
      true,
      'The investor list will be updated when the transaction on the blockchain completes',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(getWhitelist())
}

export const oneUserSubmit = () => async (dispatch: Function, getState: GetState) => {
  const user = { ...getState().form[addInvestorFormName].values }
  let newSellDate = new Date(user.sell)
  let newBuyDate = new Date(user.buy)
  let blockchainData: Investor = {
    address: user.address,
    from: newSellDate,
    to: newBuyDate,
  }
  const transferManager = getState().whitelist.transferManager
  dispatch(ui.txStart('Submitting CSV to the blockchain...'))
  try {
    const receipt = await transferManager.modifyWhitelist(blockchainData)
    dispatch(ui.notify(
      'Investor was submitted to the blockchain',
      true,
      'The investor list will be updated when the transaction on the blockchain completes',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(getWhitelist())
}

export const getWhitelist = (calenderStart?: Date, calenderEnd?: Date) => async (dispatch: Function, getState: GetState) => {
  let tableData = []
  const transferManager: TransferManager = getState().whitelist.transferManager
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
  //TODO EFFICIENCY: going through this array backwards would probably save some computation time
  for (let i =0; i < whitelistEvents.length; i++){
    let found = tableData.some(function (el, index, array) {
      //if true, User already recorded in eventList, so we don't want to make a new entry
      if( el.address === whitelistEvents[i].address ){
        // if true, this event is newer than the previous event, so we update the space in the array
        if (whitelistEvents[i].added > el.added){
          let updateArray: Investor = {
            address: whitelistEvents[i].address,
            added: whitelistEvents[i].added,
            addedBy: whitelistEvents[i].addedBy,
            from: whitelistEvents[i].from,
            to: whitelistEvents[i].to,
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
      let backendData: Investor = {
        address: whitelistEvents[i].address,
        added: whitelistEvents[i].added,
        addedBy: whitelistEvents[i].addedBy,
        from: whitelistEvents[i].from,
        to: whitelistEvents[i].to,
      }
      tableData.push(backendData)
    }
  }
  //removeZeroTimestampArray removes investors that have a zero timestamp, because they are effectively removed from trading and shouldnt be shown on the list to the user
  let removeZeroTimestampArray = []
  for (let j = 0; j < tableData.length; j++){
    if (tableData[j].from.getTime() !== 0 && tableData[j].to.getTime() !== 0 ) {
      let validInvestor: Investor = {
        address: tableData[j].address,
        added: (tableData[j].added),
        addedBy: tableData[j].addedBy,
        from: tableData[j].from,
        to: tableData[j].to,
      }
      removeZeroTimestampArray.push(validInvestor)
    }
  }
  // console.log('FINAL ARRAY: ',removeZeroTimestampArray)
  dispatch(ac_getWhitelist(removeZeroTimestampArray))
}

export const listLength = (pageNumber: number) => async (dispatch: Function) => {
  dispatch(ac_listLength(pageNumber))
}

export const removeInvestor = (addresses: Array<Address>) => async (dispatch: Function, getState: GetState) => {
  let blockchainData: Array<Investor> = []
  for (let i = 0; i < addresses.length; i++) {
    let zeroDate = new Date(0)
    let removeInvestor: Investor = {
      address: addresses[i],
      from: zeroDate,
      to: zeroDate,
    }
    blockchainData.push(removeInvestor)
  }
  const transferManager = getState().whitelist.transferManager
  dispatch(ui.txStart('Attempting to remove investors from the blockchain...'))
  try {
    const receipt = await transferManager.modifyWhitelistMulti(blockchainData)
    dispatch(ui.notify(
      'Investors Removed Successfully',
      true,
      'The investor list will be updated when the transaction on the blockchain complete',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(getWhitelist())
}

export const editInvestors = (addresses: Array<Address>) => async (dispatch: Function, getState: GetState) => {
  let investors = []
  const times = { ...getState().form[editInvestorsFormName].values }
  let newSellDate = new Date(times.sell)
  let newBuyDate = new Date(times.buy)
  for (let i = 0; i < addresses.length; i ++){
    let blockchainData: Investor = {
      address: addresses[i],
      from: newSellDate,
      to: newBuyDate,
    }
    investors.push(blockchainData)
  }
  const transferManager = getState().whitelist.transferManager
  dispatch(ui.txStart('Submitting Investor Updates to the blockchain...'))
  try {
    const receipt = await transferManager.modifyWhitelistMulti(investors)
    dispatch(ui.notify(
      'Investors Updated Successfully',
      true,
      'The investor list will be updated when the transaction on the blockchain completes',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(getWhitelist())
}
