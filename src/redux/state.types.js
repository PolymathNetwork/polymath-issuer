import reducer from './reducer'
import type { UIState } from './app/ui/state.types'

type RootState = {
  form: any,
  ui: UIState,
  dashboard: any,
  [string]: any, // Until polymath-auth exports the type of `authReducers`
}
export default RootState

export type GetState = () => RootState
