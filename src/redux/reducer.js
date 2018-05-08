// @flow

import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducer as network } from 'polymath-auth'
import { reducer as pui } from 'polymath-ui'
import type { PUIState } from 'polymath-ui'
import type { NetworkState } from 'polymath-auth'

import token from '../app/token/reducer'
import sto from '../app/sto/reducer'
import whitelist from '../app/dashboard/whitelist/reducer'
import type { WhitelistState } from '../app/dashboard/whitelist/reducer'
import type { TokenState } from '../app/token/reducer'
import type { STOState } from '../app/sto/reducer'

export default combineReducers({
  network,
  form,
  token,
  sto,
  pui,
  whitelist,
})

export type RootState = {
  network: NetworkState,
  form: any,
  token: TokenState,
  sto: STOState,
  whitelist: WhitelistState,
} & PUIState

export type GetState = () => RootState
