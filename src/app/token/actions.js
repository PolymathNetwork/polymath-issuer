// @flow

import { PolyToken, SecurityTokenRegistry } from 'polymath.js_v2'
import * as ui from 'polymath-ui'
import type { SecurityToken } from 'polymath.js_v2/types'

import { formName as completeFormName } from './components/CompleteTokenForm'
import type { GetState } from '../../redux/reducer'
import type { ExtractReturn } from '../../redux/helpers'

export const DATA = 'token/DATA'
export const data = (token: ?SecurityToken) => ({ type: DATA, token })

export type Action =
  | ExtractReturn<typeof data>

export const fetch = () => async (dispatch: Function) => {
  dispatch(ui.fetching())
  try {
    const token = await SecurityTokenRegistry.getMyToken()
    dispatch(data(token))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

export const complete = () => async (dispatch: Function, getState: GetState) => {
  try {
    const completeFee = SecurityTokenRegistry.fee
    const balance = await PolyToken.myBalance()
    if (!balance.gte(completeFee)) {
      if (getState().network.id === 1) {
        throw new Error('Insufficient POLY balance.')
      } else {
        dispatch(ui.txStart('Requesting POLY from the Polymath testnet faucet...'))
        await PolyToken.getTokens(completeFee)
      }
    }
    const isPreAuth = await SecurityTokenRegistry.isPreAuth()
    if (!isPreAuth) {
      dispatch(ui.txStart('Pre-authorizing security token creation fee of ' + completeFee.toString(10) + ' POLY...'))
      await SecurityTokenRegistry.preAuth()
    }
    const token: SecurityToken = {
      ...getState().token.token,
      ...getState().form[completeFormName].values,
    }
    dispatch(ui.txStart('Issuing ' + token.ticker + ' token...'))
    const receipt = await SecurityTokenRegistry.generateSecurityToken(token)
    dispatch(fetch())
    dispatch(ui.notify(
      token.ticker + ' token was successfully issued',
      true,
      'We have already sent you an email. Check your mailbox',
      ui.etherscanTx(receipt.transactionHash)
    ))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
