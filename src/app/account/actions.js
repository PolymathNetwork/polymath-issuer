import * as ui from 'polymath-ui'

import { formName } from './components/SignUpForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'

export const SIGNED_UP = 'account/SIGNED_UP'
export const signedUp = (value: boolean) => ({ type: SIGNED_UP, value })

export type Action =
  | ExtractReturn<typeof signedUp>

export const isSignedUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  const accountDataString = localStorage.getItem('account')
  const value = accountDataString != null && JSON.parse(accountDataString).accountJSON != null
  dispatch(signedUp(value))
  if (!value) {
    getState().pui.common.history.push('/signup')
  }
  dispatch(ui.fetched())
}

// eslint-disable-next-line
export const signUp = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching())
  try {
    const data = getState().form[formName].values

    // eslint-disable-next-line no-underscore-dangle
    let account = {
      account: {
        ...data,
        address: data['_account'],
      },
    }
    account.accountJSON = JSON.stringify(account.account)
    account.signature = await getState().network.web3.eth.sign(account.accountJSON, data['_account'])
    const accountDataString = JSON.stringify(account)
    localStorage.setItem('account', accountDataString)

    dispatch(signedUp(true))
    dispatch(ui.notify(
      'You were successfully signed up',
      true
    ))
    dispatch(ui.fetched())
    getState().pui.common.history.push('/ticker')
  } catch (e) {
    dispatch(ui.fetchingFailed())
  }
}
