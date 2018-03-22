import { TickerRegistrar } from 'polymath.js_v2'

import * as ui from '../ui/actions'
import { formName } from './components/SignUpForm'
import { tokenDetails } from '../dashboard/actions'
import { etherscanTx } from '../helpers'

// eslint-disable-next-line
export const signup = () => async (dispatch, getState) => {
  dispatch(ui.txStart('Submitting token symbol registration...'))
  try {
    const { ticker, contact } = getState().form[formName].values
    const receipt = await TickerRegistrar.registerTicker(ticker, contact)
    dispatch(ui.notify(
      'Token symbol was successfully registered',
      true,
      'We have already sent you an email. Check your mailbox',
      etherscanTx(receipt.transactionHash)
    ))
    dispatch(tokenDetails())
    getState().ui.history.push('/dashboard')
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
