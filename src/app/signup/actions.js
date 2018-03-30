import { TickerRegistry } from 'polymath.js_v2'
import { notify } from 'polymath-ui'

import * as ui from '../ui/actions'
import { formName } from './components/SignUpForm'
import { fetchTokenDetails } from '../dashboard/actions'
import { etherscanTx } from '../helpers'
import type { GetState } from '../../redux/state.types'

// eslint-disable-next-line
export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.txStart('Submitting token symbol registration...'))
  try {
    const { ticker, contact } = getState().form[formName].values
    const receipt = await TickerRegistry.registerTicker(ticker, contact)
    dispatch(notify({
      title: 'Token symbol was successfully registered',
      isSuccess: true,
      subtitle: 'We have already sent you an email. Check your mailbox',
      caption: etherscanTx(receipt.transactionHash),
    }))
    dispatch(fetchTokenDetails())

    const history = getState().ui.history
    if (history) {
      history.push('/dashboard')
    }
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
