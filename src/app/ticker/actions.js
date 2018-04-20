import { TickerRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { SymbolDetails } from 'polymathjs/types'

import { formName } from './components/TickerForm'
import { fetchAPI, getAccountData } from '../offchain'
import type { GetState } from '../../redux/reducer'

// eslint-disable-next-line
export const register = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.txStart('Submitting token symbol registration...'))
  try {
    const details: SymbolDetails = getState().form[formName].values
    const receipt = await TickerRegistry.registerTicker(details)

    const emailResult = await fetchAPI({
      query: `
        mutation ($accountData: AccountData!, $txHash: String!, $symbolDetails: SymbolDetails!) {
          withAccount(accountData: $accountData, txHash: $txHash) {
            sendEmailRegisterTicker(symbolDetails: $symbolDetails)
          }
        }
      `,
      variables: {
        accountData: getAccountData(),
        txHash: receipt.transactionHash,
        symbolDetails: {
          ticker: details.ticker,
          name: details.name,
          company: details.company,
          desc: details.desc,
        },
      },
    })

    if (emailResult.errors) {
      // eslint-disable-next-line no-console
      console.error('sendEmailRegisterTicker failed:', emailResult.errors)
    }

    dispatch(ui.notify(
      'Token symbol was successfully registered',
      true,
      'We\'ve sent you an email. Check your inbox.',
      ui.etherscanTx(receipt.transactionHash)
    ))
    getState().pui.common.history.push('/dashboard/' + details.ticker)
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
