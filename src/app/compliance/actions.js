// @flow

import * as ui from 'polymath-ui'
import { ethereumAddress } from 'polymath-ui/dist/validate'
import type { Investor, Address } from 'polymathjs/types'

import { formName as addInvestorFormName } from './components/AddInvestorForm'
import { formName as editInvestorsFormName } from './components/EditInvestorsForm'
import type { GetState } from '../../redux/reducer'

export const PERMANENT_LOCKUP_TS = 67184812800000 // milliseconds

export const TRANSFER_MANAGER = 'compliance/TRANSFER_MANAGER'
export const WHITELIST = 'compliance/WHITELIST'
export const UPLOADED = 'compliance/UPLOADED'

export const LIST_LENGTH = 'compliance/WHITELIST_LENGTH'
export const listLength = (listLength: number) => ({ type: LIST_LENGTH, listLength })

export const RESET_UPLOADED = 'compliance/RESET_UPLOADED'
export const resetUploaded = () => ({ type: RESET_UPLOADED })

export type InvestorCSVRow = [number, string, string, string, string]

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

export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    const investors: Array<Investor> = []
    const criticals: Array<InvestorCSVRow> = []
    let isTooMany = false
    let string = 0
    // $FlowFixMe
    for (let entry of reader.result.split(/\r\n|\n/)) {
      string++
      const [address, sale, purchase, expiryIn] = entry.split(',')
      const handleDate = (d: string) => d === '' ? new Date(PERMANENT_LOCKUP_TS) : new Date(Date.parse(d))
      const from = handleDate(sale)
      const to = handleDate(purchase)
      const expiry = new Date(Date.parse(expiryIn))
      if (ethereumAddress(address) === null && !isNaN(from) && !isNaN(to) && !isNaN(expiry)) {
        if (investors.length === 75) {
          isTooMany = true
          continue
        }
        investors.push({ address, from, to, expiry })
      } else {
        criticals.push([string, address, sale, purchase, expiryIn])
      }
    }
    dispatch({ type: UPLOADED, investors, criticals, isTooMany })
  }
}

export const importWhitelist = () => async (dispatch: Function, getState: GetState) => {
  const { uploaded, transferManager } = getState().whitelist
  dispatch(ui.tx(
    'Submitting Approved Investors',
    async () => {
      await transferManager.modifyWhitelistMulti(uploaded)
    },
    'Investors has been added successfully',
    () => {
      dispatch(resetUploaded())
      return dispatch(fetchWhitelist())
    },
    undefined,
    undefined,
    true
  ))
}

export const addInvestor = () => async (dispatch: Function, getState: GetState) => {
  const { values } = getState().form[addInvestorFormName]
  const investor: Investor = {
    address: values.address,
    from: new Date(values.permanentSale ? PERMANENT_LOCKUP_TS : values.sale),
    to: new Date(values.permanentPurchase ? PERMANENT_LOCKUP_TS : values.purchase),
    expiry: new Date(values.expiry),
  }
  const { transferManager } = getState().whitelist

  dispatch(ui.tx(
    'Submitting Approved Investor',
    async () => {
      await transferManager.modifyWhitelist(investor)
    },
    'Investor has been added successfully',
    () => {
      return dispatch(fetchWhitelist())
    },
    undefined,
    undefined,
    true
  ))
}

export const editInvestors = (addresses: Array<Address>) => async (dispatch: Function, getState: GetState) => {
  const { values } = getState().form[editInvestorsFormName]
  const investor: Investor = {
    address: '',
    from: new Date(values['e_permanentSale'] ? PERMANENT_LOCKUP_TS : values.sale),
    to: new Date(values['e_permanentPurchase'] ? PERMANENT_LOCKUP_TS : values.purchase),
    expiry: new Date(values.expiry),
  }
  const investors = []
  for (let i = 0; i < addresses.length; i++) {
    investors.push({ ...investor, address: addresses[i] })
  }
  const { transferManager } = getState().whitelist

  dispatch(ui.tx(
    'Updating Lockup Dates',
    async () => {
      await transferManager.modifyWhitelistMulti(investors)
    },
    'Lockup dates has been updated successfully',
    () => {
      return dispatch(fetchWhitelist())
    },
    undefined,
    undefined,
    true
  ))
}

export const removeInvestors = (addresses: Array<Address>) => async (dispatch: Function, getState: GetState) => {
  const investors: Array<Investor> = []
  for (let i = 0; i < addresses.length; i++) {
    const removeInvestor: Investor = {
      address: addresses[i],
      from: new Date(0),
      to: new Date(0),
      expiry: new Date(0),
    }
    investors.push(removeInvestor)
  }
  const { transferManager } = getState().whitelist
  const plural = addresses.length > 1 ? 's' : ''

  dispatch(ui.tx(
    `Removing investor${plural}`,
    async () => {
      await transferManager.modifyWhitelistMulti(investors)
    },
    `Investor${plural} has been removed successfully`,
    () => {
      return dispatch(fetchWhitelist())
    },
    undefined,
    undefined,
    true
  ))
}
