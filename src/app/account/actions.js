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

export const ACCOUNT_KEY = 'account'

export const init = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())

  const accountDataString = localStorage.getItem(ACCOUNT_KEY)
  const value = accountDataString != null && JSON.parse(accountDataString).accountJSON != null
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

// eslint-disable-next-line
export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const data = getState().form[formName].values

    const { web3 } = getState().network
    if (!web3) {
      throw new Error('web3 is undefined')
    }

    const address = getState().network.account
    const innerAccount = {
      ...data,
      address: address,
    }
    const accountJSON = JSON.stringify(innerAccount)
    const signature = await web3.eth.sign(accountJSON, address)

    let accountData = {
      account: innerAccount,
      accountJSON,
      signature,
    }
    const accountDataString = JSON.stringify(accountData)
    localStorage.setItem('account', accountDataString)

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
