import { TickerRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { SymbolDetails } from 'polymathjs/types'

import { formName } from './components/TickerForm'
import type { GetState } from '../../redux/reducer'

// eslint-disable-next-line
export const register = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.txStart('Submitting token symbol registration...'))
  try {
    const details: SymbolDetails = getState().form[formName].values
    const receipt = await TickerRegistry.registerTicker(details)
    dispatch(ui.notify(
      'Token symbol was successfully registered',
      true,
      'We have already sent you an email. Check your mailbox',
      ui.etherscanTx(receipt.transactionHash)
    ))
    getState().pui.common.history.push(`/dashboard/${details.ticker}`)
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
