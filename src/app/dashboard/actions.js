import BigNumber from 'bignumber.js'
import { PolyToken } from 'polymath.js_v2'

import * as ui from '../ui/actions'
import { etherscanTx } from '../helpers'
import { formName as completeTokenFormName } from './components/CompleteTokenForm'

export const TOKEN_DETAILS = 'dashboard/TOKEN'

// TODO @bshevchenko: extract into the polymath.js_v2
class Type {
  constructor (data) {
    Object.keys(data).forEach((i) => {
      this[i] = data[i]
    })
  }
}

// TODO @bshevchenko: extract into the polymath.js_v2
export class SecurityToken extends Type {
  ticker: string
  contactName: string
  contactEmail: string
  owner: string
  address: ?string
  name: ?string
  totalSupply: ?number
  decimals: ?number
  website: ?string
}

// TODO @bshevchenko: isMockCompleted param is only for tests
// eslint-disable-next-line
export const tokenDetails = (ticker: string, isMockCompleted: boolean = false) => async (dispatch) => {
  dispatch(ui.fetching('Retrieving token details...'))
  try {
    const token = new SecurityToken({ // TODO @bshevchenko: await SecurityTokenRegistrar.getTokenByTicker(ticker)
      ticker,
      contactName: 'Trevor Koverko',
      contactEmail: 'trevor@polymath.network',
      owner: '0x410015e9c954d7201dcaa01424e07e0748f740a5',
      ...(isMockCompleted ? {
        address: '0x7A681ceC90817A0B2eb104D6E0B137eB0B1806b8',
        name: 'Polymath Utility Token',
        totalSupply: 10000000,
        decimals: 12,
        website: 'https://polymath.network',
      } : {}),
    })
    dispatch({ type: TOKEN_DETAILS, token })
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

export const completeToken = () => async (dispatch, getState) => {
  try {
    const completeFee = new BigNumber(250) // TODO @bshevchenko: retrieve fee from the polymath.js
    const balance = await PolyToken.myBalance()
    if (!balance.gte(completeFee)) {
      if (getState().network.id === 1) {
        throw new Error('Insufficient POLY balance.')
      } else {
        dispatch(ui.txStart('Requesting POLY from the Polymath testnet faucet...'))
        await PolyToken.getTokens(completeFee)
      }
    }
    const isPreAuth = false // TODO @bshevchenko:  await SecurityTokenRegistrar.isPreAuth()
    if (!isPreAuth) {
      dispatch(ui.txStart('Pre-authorizing security token creation fee of ' + completeFee.toString(10) + ' POLY...'))
      await PolyToken.getTokens(completeFee) // TODO @bshevchenko: await SecurityTokenRegistrar.preAuth()
    }
    const token: SecurityToken = new SecurityToken({
      ...getState().dashboard.token,
      ...getState().form[completeTokenFormName].values,
    })
    dispatch(ui.txStart('Issuing ' + token.ticker + ' token...'))
    const receipt = await PolyToken.getTokens(completeFee) // TODO @bshevchenko: await SecurityTokenRegistrar.issueSecurityToken(token)
    dispatch(ui.notify(
      token.ticker + ' token was successfully issued',
      true,
      'We have already sent you an email. Check your mailbox',
      etherscanTx(receipt.transactionHash)
    ))
    const isMockCompleted = true // TODO @bshevchenko: this variable is only for tests
    dispatch(tokenDetails(token.ticker, isMockCompleted))
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
