// @flow

import type { DispatchAPI } from 'redux'
import { PolyToken, SecurityTokenRegistrar } from 'polymath.js_v2'
import type { SecurityToken } from 'polymath.js_v2/types'

import * as ui from '../ui/actions'
import { etherscanTx } from '../helpers'
import type { GetState } from '../../redux/state.types'
import type { ExtractReturn } from '../../redux/helpers'
import { formName as completeTokenFormName } from './components/CompleteTokenForm'

export const TOKEN_DETAILS = 'dashboard/TOKEN_DETAILS'
export const tokenDetails = (token: SecurityToken) => ({ type: "dashboard/TOKEN_DETAILS", token })

export type DashboardAction =
  | ExtractReturn<typeof tokenDetails>

export const fetchTokenDetails = () => async (dispatch: DispatchAPI<*>) => {
  dispatch(ui.fetching('Loading...'))
  try {
    let token = await SecurityTokenRegistrar.getMyToken()
    dispatch(tokenDetails(token))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

export const completeToken = () => async (dispatch: DispatchAPI<*>, getState: GetState) => {
  try {
    const completeFee = SecurityTokenRegistrar.fee
    const balance = await PolyToken.myBalance()
    if (!balance.gte(completeFee)) {
      if (getState().network.id === 1) {
        throw new Error('Insufficient POLY balance.')
      } else {
        dispatch(ui.txStart('Requesting POLY from the Polymath testnet faucet...'))
        await PolyToken.getTokens(completeFee)
      }
    }
    const isPreAuth = await SecurityTokenRegistrar.isPreAuth()
    if (!isPreAuth) {
      dispatch(ui.txStart('Pre-authorizing security token creation fee of ' + completeFee.toString(10) + ' POLY...'))
      await SecurityTokenRegistrar.preAuth()
    }
    const token: SecurityToken = {
      ...getState().dashboard.token,
      ...getState().form[completeTokenFormName].values,
    }
    dispatch(ui.txStart('Issuing ' + token.ticker + ' token...'))
    const receipt = await SecurityTokenRegistrar.generateSecurityToken(token)
    dispatch(ui.notify(
      token.ticker + ' token was successfully issued',
      true,
      'We have already sent you an email. Check your mailbox',
      etherscanTx(receipt.transactionHash)
    ))
    dispatch(fetchTokenDetails())
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
