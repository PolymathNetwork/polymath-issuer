// @flow

import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducers as authReducers } from 'polymath-auth'
import { reducer as pui } from 'polymath-ui'
import token from '../app/token/reducer'
import sto from '../app/sto/reducer'
import type { TokenState } from '../app/token/reducer'
import type { STOState } from '../app/sto/reducer'

export default combineReducers({
  ...authReducers,
  form,
  token,
  sto,
  pui,
})

export type RootState = {
  form: any,
  token: TokenState,
  sto: STOState,
  network: any, // TODO @bshevchenko: set type https://github.com/PolymathNetwork/polymath-issuer/issues/5
}

export type GetState = () => RootState
