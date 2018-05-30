// @flow

import * as ui from 'polymath-ui'
import { ethereumAddress } from 'polymath-ui/dist/validate'
import type { Investor, Address } from 'polymathjs/types'

import { formName as addInvestorFormName } from './components/AddInvestorForm'
import { formName as editInvestorsFormName } from './components/EditInvestorsForm'
import type { GetState } from '../../redux/reducer'
import type { ExtractReturn } from '../../redux/helpers'

export const PERMANENT_LOCKUP_TS = 67184812800000 // milliseconds

export const TRANSFER_MANAGER = 'compliance/TRANSFER_MANAGER'

export const UPLOAD_CSV = 'compliance/UPLOAD_CSV'
export const ac_csvUpload = (
  addresses: Array<Address>,
  sell: Array<Address>,
  buy: Array<Address>,
  previewCSVShowing: boolean
) => ({ type: UPLOAD_CSV, addresses, sell, buy, previewCSVShowing })
export const UPLOAD_CSV_FAILED = 'compliance/UPLOAD_CSV_FAILED'

export const WHITELIST = 'compliance/WHITELIST'

export const LIST_LENGTH = 'compliance/WHITELIST_LENGTH'
export const listLength = (listLength: number) => ({ type: LIST_LENGTH, listLength })

export type Action =
  | ExtractReturn<typeof ac_csvUpload>

export const fetchWhitelist = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    if (!getState().whitelist.transferManager) {
      const { token } = getState().token
      // $FlowFixMe
      dispatch({ type: TRANSFER_MANAGER, transferManager: await token.contract.getTransferManager() })
    }

    const { transferManager } = getState().whitelist
    const tableData = []
    const investors = await transferManager.getWhitelist()

    for (let i = 0; i < investors.length; i++) {
      const found = tableData.some((el, index, array) => {
        // if true, User already recorded in eventList, so we don't want to make a new entry
        if (el.address === investors[i].address) {
          // if true, this event is newer than the previous event, so we update the space in the array
          if (investors[i].added > el.added) {
            array[index] = investors[i]
            return true
          }
          return true
        }
        // found returns false because it doesn't exist. so we add it below as backendData
        return false
      })
      if (!found) {
        tableData.push(investors[i])
      }
    }
    // removeZeroTimestampArray removes investors that have a zero timestamp,
    // because they are effectively removed from trading and shouldn't be shown on the list to the user
    const removeZeroTimestampArray = []
    for (let j = 0; j < tableData.length; j++) {
      if (tableData[j].from.getTime() !== 0 && tableData[j].to.getTime() !== 0) {
        removeZeroTimestampArray.push(tableData[j])
      }
    }
    dispatch({ type: WHITELIST, investors: removeZeroTimestampArray })

    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

// Uploads the CSV file, reads it with built in js FileReader(), dispatches to the store the csv file information,
// which can then be sent to the blockchain with multiUserSubmit()

// Note: We just Object type, instead of File type, because here
// we get passed a File directly from the dropzone, and an event
// from the upload button, and then we determine whether it is a file or not inside of uploadCSV()

// TODO @bshevchenko: we need to limit CSV file to 75
// them that it is too long? also keep in mind gas limit and WS packet size
export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  let parseFile
  if (file.target === undefined) {
    parseFile = file
  } else {
    parseFile = file.target.files[0]
  }
  const textType = /csv.*/
  if (parseFile.type.match(textType)) {
    const reader = new FileReader()
    reader.readAsText(parseFile)
    reader.onload = function () {
      const parsedData = parseCSV(((reader.result: any): string))
      const isSuccess = !!parsedData[0].length
      if (!isSuccess) {
        alert('There is no valid entries in your file. Please follow the described format.')
      }
      dispatch(ac_csvUpload(parsedData[0], parsedData[1], parsedData[2], isSuccess))
    }
  } else {
    dispatch({ type: UPLOAD_CSV_FAILED })
  }
}

// Takes the CSV data, turns it into two arrays, split up by addresses and time they are allowed to trade for , in order
const parseCSV = (csvResult: string) => {
  const parsedData = []
  const addresses = []
  const sellRestriction = []
  const buyRestriction = []
  const allTextLines = csvResult.split(/\r\n|\n/)
  const zeroX = '0x'
  for (let i = 0; i < allTextLines.length; i++) {
    const entry = allTextLines[i]
    if (entry.includes(zeroX)) {
      let [address, sell, buy] = entry.split(',', 4)
      if (ethereumAddress(address) !== null) {
        [address, sell, buy] = entry.split(';', 4)
      }
      if (ethereumAddress(address) === null && !isNaN(Date.parse(sell)) && !isNaN(Date.parse(buy))) {
        addresses.push(address)
        sellRestriction.push(sell)
        buyRestriction.push(buy)
      }
    }
  }
  parsedData.push(addresses)
  parsedData.push(sellRestriction)
  parsedData.push(buyRestriction)
  return parsedData
}

// This takes the CSV data we have stored in the store from uploadCSV, and then submits it to the blockchain
export const multiUserSubmit = () => async (dispatch: Function, getState: GetState) => {
  const blockchainData = []
  const csvAddresses = getState().whitelist.addresses
  const csvSell = getState().whitelist.sell
  const csvBuy = getState().whitelist.buy
  for (let i = 0; i < csvAddresses.length; i++) {
    const newSellDate = new Date(csvSell[i])
    const newBuyDate = new Date(csvBuy[i])
    const investorData: Investor = {
      address: csvAddresses[i],
      from: newSellDate,
      to: newBuyDate,
    }
    blockchainData.push(investorData)
  }
  const transferManager = getState().whitelist.transferManager
  dispatch(ui.txStart('Submitting Approved Investors...'))
  try {
    const receipt = await transferManager.modifyWhitelistMulti(blockchainData)
    dispatch(
      ui.notify(
        'Investors from the CSV were successfully Uploaded',
        true,
        null,
        ui.etherscanTx(receipt.transactionHash)
      )
    )
    dispatch(ac_csvUpload([], [], [], false))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(fetchWhitelist())
}

export const addInvestor = () => async (dispatch: Function, getState: GetState) => {
  const { values } = getState().form[addInvestorFormName]
  const investor: Investor = {
    address: values.address,
    from: new Date(values.permanentSale ? PERMANENT_LOCKUP_TS : values.sale),
    to: new Date(values.permanentPurchase ? PERMANENT_LOCKUP_TS : values.purchase),
  }
  const { transferManager } = getState().whitelist
  dispatch(ui.txStart('Submitting Approved Investor...'))
  try {
    const receipt = await transferManager.modifyWhitelist(investor)
    dispatch(
      ui.notify(
        'Investor has been added successfully',
        true,
        null,
        ui.etherscanTx(receipt.transactionHash)
      )
    )
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(fetchWhitelist())
}

export const editInvestors = (addresses: Array<Address>) => async (dispatch: Function, getState: GetState) => {
  const { values } = getState().form[editInvestorsFormName]
  const investor: Investor = {
    address: '',
    from: new Date(values['e_permanentSale'] ? PERMANENT_LOCKUP_TS : values.sale),
    to: new Date(values['e_permanentPurchase'] ? PERMANENT_LOCKUP_TS : values.purchase),
  }
  const investors = []
  for (let i = 0; i < addresses.length; i++) {
    investors.push({ ...investor, address: addresses[i] })
  }
  const { transferManager } = getState().whitelist
  dispatch(ui.txStart('Updating Lockup Dates...'))
  try {
    const receipt = await transferManager.modifyWhitelistMulti(investors)
    dispatch(
      ui.notify(
        'Lockup dates has been updated successfully',
        true,
        null,
        ui.etherscanTx(receipt.transactionHash)
      )
    )
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(fetchWhitelist())
}

export const removeInvestors = (addresses: Array<Address>) => async (dispatch: Function, getState: GetState) => {
  const investors: Array<Investor> = []
  for (let i = 0; i < addresses.length; i++) {
    const removeInvestor: Investor = {
      address: addresses[i],
      from: new Date(0),
      to: new Date(0),
    }
    investors.push(removeInvestor)
  }
  const { transferManager } = getState().whitelist
  const plural = addresses.length > 1 ? 's' : ''
  dispatch(ui.txStart(`Removing investor${plural}...`))
  try {
    const receipt = await transferManager.modifyWhitelistMulti(investors)
    dispatch(
      ui.notify(
        `Investor${plural} has been removed successfully`,
        true,
        null,
        ui.etherscanTx(receipt.transactionHash)
      )
    )
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
  dispatch(fetchWhitelist())
}
