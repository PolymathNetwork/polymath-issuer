// @flow

import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducer as network } from 'polymath-auth'
import { reducer as pui } from 'polymath-ui'
import type { PUIState } from 'polymath-ui'
import type { NetworkState } from 'polymath-auth'

import providers  from '../app/providers/reducer'
import token from '../app/token/reducer'
import sto from '../app/sto/reducer'
import ticker from '../app/ticker/reducer'
import whitelist from '../app/compliance/reducer'
import type { ProvidersState } from '../app/providers/reducer'
import type { TokenState } from '../app/token/reducer'
import type { STOState } from '../app/sto/reducer'
import type { TickerState } from '../app/ticker/reducer'
import type { WhitelistState } from '../app/compliance/reducer'

export default combineReducers({
  network,
  form,
  ticker,
  providers,
  token,
  sto,
  pui,
  whitelist,
})

export type RootState = {
  network: NetworkState,
  providers: ProvidersState,
  ticker: TickerState,
  token: TokenState,
  sto: STOState,
  whitelist: WhitelistState,
  pui: PUIState,
  form: any,
}

export type GetState = () => RootState
