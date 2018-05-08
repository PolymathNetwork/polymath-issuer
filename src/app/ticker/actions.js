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

    const accountData = ui.getAccountData(getState())
    if (!accountData) {
      throw new Error('Not signed in')
    }
    delete accountData.account

    const emailResult = await ui.offchainFetch({
      query: `
        mutation ($account: WithAccountInput!, $input: EmailRegisterTickerInput!) {
          withAccount(input: $account) {
            sendEmailRegisterTicker(input: $input)
          }
        }
      `,
      variables: {
        account: {
          accountData: accountData,
          txHash: receipt.transactionHash,
        },
        input: {
          ticker: details.ticker,
          name: details.name,
        },
      },
    })

    if (emailResult.errors) {
      // eslint-disable-next-line no-console
      console.error('sendEmailRegisterTicker failed:', emailResult.errors)
    }

    dispatch(
      ui.txSuccess(
        'Token Symbol Was Registered Successfully',
        'Go to dashboard',
        `/dashboard/${details.ticker}`
      )
    )
  } catch (e) {
    dispatch(ui.txFailed(e))
  }
}
