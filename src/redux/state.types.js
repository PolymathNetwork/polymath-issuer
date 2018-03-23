// @flow

import type { DashboardState } from '../app/dashboard/state.types'
import type { UIState } from '../app/ui/state.types'

export type RootState = {
  form: any,
  ui: UIState,
  dashboard: DashboardState,
  network: any, // Until polymath-auth exports the type of `authReducers`
  thing: string,
}

export type GetState = () => RootState
