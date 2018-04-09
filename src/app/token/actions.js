// @flow

import { SecurityTokenRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'

import { formName as completeFormName } from './components/CompleteTokenForm'
import type { GetState } from '../../redux/reducer'
import type { ExtractReturn } from '../../redux/helpers'

export const DATA = 'token/DATA'
export const data = (token: ?SecurityToken) => ({ type: DATA, token })

export type Action =
  | ExtractReturn<typeof data>

export const fetch = (ticker: string) => async (dispatch: Function) => {
  dispatch(ui.fetching())
  try {
    const token = await SecurityTokenRegistry.getTokenByTicker(ticker)
    dispatch(data(token))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

export const complete = () => async (dispatch: Function, getState: GetState) => {
  const token = getState().token.token
  if (!token) {
    return
  }
  dispatch(ui.txStart('Issuing ' + token.ticker + ' token...'))
  try {
    const token: SecurityToken = {
      ...getState().token.token,
      ...getState().form[completeFormName].values,
    }
    const receipt = await SecurityTokenRegistry.generateSecurityToken(token.name, token.ticker)
    dispatch(fetch(token.ticker))
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
