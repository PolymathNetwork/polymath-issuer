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
  const value = localStorage.getItem('account') !== null
  dispatch(signedUp(value)) // TODO @bshevchenko: use API
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
    data._signature = await getState().network.web3.eth.sign(data, data._account)
    localStorage.setItem('account', JSON.stringify(data)) // TODO @bshevchenko: use API
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
