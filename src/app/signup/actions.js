// @flow

// import { formName } from './components/SignUpForm'
import type { DispatchAPI } from 'redux'
import { PolyToken } from 'polymath.js_v2'
import { txStart, txFailed, notify } from '../ui/actions'
import { etherscanTx } from '../helpers'
import type { GetState } from '../../redux/state.types'

// eslint-disable-next-line
export const signUp = () => async (dispatch: DispatchAPI<*>, getState: GetState) => {
  dispatch(txStart('Submitting token symbol registration...'))
  try {
    // TODO @bshevchenko: await SecurityTokenRegistrar.createTokenSymbol(getState().form[formName].values)
    const receipt = await PolyToken.getTokens(200000)
    dispatch(notify(
      'Token symbol was successfully registered',
      true,
      'We have already sent you an email. Check your mailbox',
      etherscanTx(receipt.transactionHash)
    ))

    const history = getState().ui.history
    if (history) {
      history.push('/dashboard/token/POLY') // TODO @bshevchenko: put real ticker
    }
  } catch (e) {
    dispatch(txFailed(e))
  }
}
