// @flow

import BigNumber from 'bignumber.js'
import { PolyToken } from 'polymathjs'
import * as ui from 'polymath-ui'

import { formName } from './components/SignUpForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'

export const SIGNED_UP = 'account/SIGNED_UP'
export const signedUp = (value: boolean) => ({ type: SIGNED_UP, value })

export const BALANCE = 'account/BALANCE'
export const setBalance = (balance: BigNumber) => ({ type: BALANCE, balance })

export type Action =
  | ExtractReturn<typeof signedUp>
  | ExtractReturn<typeof setBalance>

export const init = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  const value = localStorage.getItem(String(getState().network.account)) !== null
  let balance
  try {
    balance = await PolyToken.myBalance()
    await PolyToken.subscribeMyTransfers(async () => {
      dispatch(setBalance(await PolyToken.myBalance()))
    })
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
    return
  }
  dispatch(signedUp(value))
  dispatch(setBalance(balance))
  if (!value) {
    getState().pui.common.history.push('/signup')
  }
  dispatch(ui.fetched())
}

export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const data = getState().form[formName].values
    const account = getState().network.account
    const { web3 } = getState().network
    if (!web3 || !account) {
      throw new Error('web3 or account is undefined')
    }
    const jsonData = JSON.stringify(data)
    data.signature = await web3.eth.sign(jsonData, account)
    localStorage.setItem(account, jsonData)
    dispatch(signedUp(true))
    dispatch(ui.notify(
      'You were successfully signed up',
      true
    ))
    dispatch(ui.fetched())
    getState().pui.common.history.push('/ticker')
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}
