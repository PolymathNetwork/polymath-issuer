// import { formName } from './components/SignUpForm'
import { txStart, txEnd } from '../ui/actions'

// eslint-disable-next-line
export const signup = () => async (dispatch) => {
  dispatch(txStart('Submitting token symbol registration...'))
  try {
    // TODO @bshevchenko: await SecurityTokenRegistrar.createTokenSymbol(getState().form[formName].values)
    // TODO @bshevchenko: getState().ui.history.push('/investor/documents')
  } catch (e) {
    dispatch(txEnd())
  }
}
