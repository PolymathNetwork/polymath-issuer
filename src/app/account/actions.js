// @flow

import BigNumber from 'bignumber.js'
import { PolyToken } from 'polymathjs'
import * as ui from 'polymath-ui'

import { formName } from './components/SignUpForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'

export const SIGNED_UP = 'account/SIGNED_UP'
export const signedUp = (value: boolean, balance: BigNumber) => ({ type: SIGNED_UP, value, balance })

export type Action =
  | ExtractReturn<typeof signedUp>

export const ACCOUNT_KEY = 'account'

export const init = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  const value = localStorage.getItem(ACCOUNT_KEY) !== null
  let balance
  try {
    balance = await PolyToken.myBalance()
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
    return
  }
  dispatch(signedUp(value, balance))
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
    const jsonData = JSON.stringify(data)
    const { web3 } = getState().network
    if (!web3) {
      throw new Error('web3 is undefined')
    }
    // noinspection JSUnresolvedVariable
    data.signature = await web3.eth.sign(jsonData, getState().network.account)
    localStorage.setItem(ACCOUNT_KEY, jsonData)
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
