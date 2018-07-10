// @flow

import { PolyToken, SecurityTokenRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import { ethereumAddress } from 'polymath-ui/dist/validate'
import type { SecurityToken, Investor, Address } from 'polymathjs/types'

import { formName as completeFormName } from './components/CompleteTokenForm'
import { fetch as fetchSTO } from '../sto/actions'
import { PERMANENT_LOCKUP_TS } from '../compliance/actions'
import type { GetState } from '../../redux/reducer'
import type { ExtractReturn } from '../../redux/helpers'

export const MINT_UPLOADED = 'token/mint/UPLOADED'
export const MINT_RESET_UPLOADED = 'token/mint/RESET_UPLOADED'
export const mintResetUploaded = () => ({ type: MINT_RESET_UPLOADED })

export const DATA = 'token/DATA'
export const data = (token: ?SecurityToken) => ({ type: DATA, token })

export type Action =
  | ExtractReturn<typeof data>

export type InvestorCSVRow = [number, string, string, string, string, string]

export const fetch = (ticker: string) => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const expires = new Date()
    expires.setDate(expires.getDate() + 1)
    const token: SecurityToken = await SecurityTokenRegistry.getTokenByTicker(ticker)
    if (token && token.owner !== getState().network.account) {
      throw new Error('permission denied')
    }
    dispatch(data(token))
    dispatch(fetchSTO())
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

export const issue = (polyCost: number) => async (dispatch: Function, getState: GetState) => {
  const { token } = getState().token // $FlowFixMe
  const ticker = token.ticker

  dispatch(ui.tx(
    ['Token Creation Fee ', 'Token Creation'],
    async () => {
      const token: SecurityToken = {
        ...getState().token.token,
        ...getState().form[completeFormName].values,
      }
      token.isDivisible = token.isDivisible !== '1'
      try {
        await SecurityTokenRegistry.generateSecurityToken(token)
        dispatch(ui.notify(
          'Spent '+ polyCost + ' POLY',
          true
        ))
        dispatch(ui.setBalance(await PolyToken.myBalance()))     
      }catch (e){
        throw e
      }      
    },
    'Token Was Issued Successfully',
    () => {
      return dispatch(fetch(ticker))
    },
    `/dashboard/${ticker}/sto`,
    undefined,
    true, // TODO @bshevchenko,
    ticker.toUpperCase()+' Token Creation'
  ))
}

export const faucet = (address: ?string, POLYamount: number) => async (dispatch: Function) => {
  dispatch(ui.tx(
    ['Receiving POLY From Faucet'],
    async () => {
      try {
        await PolyToken.getTokens(POLYamount, address)
        dispatch(ui.notify(
          'Received ' + POLYamount + ' POLY',
          true
        ))
        dispatch(ui.setBalance(await PolyToken.myBalance()))
      } catch (e) {
        throw e
      }
    },
    'You have successfully received ' + POLYamount + ' POLY',
    undefined,
    undefined,
    'ok',
    true // TODO @bshevchenko: !isEmailConfirmed
  ))
}

// TODO @bshevchenko: almost duplicates uploadCSV from compliance/actions, subject to refactor
export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    const investors: Array<Investor> = []
    const criticals: Array<InvestorCSVRow> = []
    const tokens: Array<number> = []
    let isTooMany = false
    let string = 0
    // $FlowFixMe
    for (let entry of reader.result.split(/\r\n|\n/)) {
      string++
      const [address, sale, purchase, expiryIn, tokensIn] = entry.split(',')
      const handleDate = (d: string) => d === '' ? new Date(PERMANENT_LOCKUP_TS) : new Date(Date.parse(d))
      const from = handleDate(sale)
      const to = handleDate(purchase)
      const expiry = new Date(Date.parse(expiryIn))
      const tokensVal = Number(tokensIn)
      if (ethereumAddress(address) === null && !isNaN(from) && !isNaN(to) && !isNaN(expiry)
        && Number.isInteger(tokensVal) && tokensVal > 0) {
        if (investors.length === 75) {
          isTooMany = true
          continue
        }
        investors.push({ address, from, to, expiry })
        tokens.push(tokensVal)
      } else {
        criticals.push([string, address, sale, purchase, expiryIn, tokensIn])
      }
    }
    dispatch({ type: MINT_UPLOADED, investors, tokens, criticals, isTooMany })
  }
}

export const mintTokens = () => async (dispatch: Function, getState: GetState) => {
  const { token, mint: { uploaded, uploadedTokens } } = getState().token // $FlowFixMe
  const transferManager = await token.contract.getTransferManager()

  dispatch(ui.tx(
    ['Whitelisting Addresses', 'Minting Tokens'],
    async () => {
      await transferManager.modifyWhitelistMulti(uploaded, false)
      const addresses: Array<Address> = []
      for (let investor: Investor of uploaded) {
        addresses.push(investor.address)
      } // $FlowFixMe
      await token.contract.mintMulti(addresses, uploadedTokens)
    },
    'Tokens were successfully minted',
    () => {
      return dispatch(mintResetUploaded())
    },
    undefined,
    undefined,
    true // TODO @bshevchenko
  ))
}
