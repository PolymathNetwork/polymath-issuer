import { TickerRegistry } from 'polymath.js_v2'
import * as ui from 'polymath-ui'

import { formName } from './components/SignUpForm'
import { fetch } from '../token/actions'
import type { GetState } from '../../redux/reducer'

// eslint-disable-next-line
export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.txStart('Submitting token symbol registration...'))
  try {
    const { ticker, contact } = getState().form[formName].values
    const receipt = await TickerRegistry.registerTicker(ticker, contact)
    dispatch(ui.notify(
      'Token symbol was successfully registered',
      true,
      'We have already sent you an email. Check your mailbox',
      ui.etherscanTx(receipt.transactionHash)
    ))
    dispatch(fetch())

    getState().pui.common.history.push('/dashboard')
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
