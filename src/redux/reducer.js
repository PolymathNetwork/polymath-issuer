// @flow

import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducers as authReducers } from 'polymath-auth'
import { reducer as pui } from 'polymath-ui'
import token from '../app/token/reducer'
import sto from '../app/sto/reducer'
import whitelist from '../app/dashboard/whitelist/reducer'
import type { WhitelistState } from '../app/dashboard/whitelist/reducer'
import type { TokenState } from '../app/token/reducer'
import type { STOState } from '../app/sto/reducer'

export default combineReducers({
  ...authReducers,
  form,
  token,
  sto,
  pui,
  whitelist,
})

export type RootState = {
  form: any,
  token: TokenState,
  sto: STOState,
  whitelist: WhitelistState,
  network: any, // TODO @bshevchenko: set type https://github.com/PolymathNetwork/polymath-issuer/issues/5
}

export type GetState = () => RootState
