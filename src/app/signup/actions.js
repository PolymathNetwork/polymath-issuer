// import { formName } from './components/SignUpForm'
import { PolyToken } from 'polymath.js_v2'
import { txStart, txFailed } from '../ui/actions'

// eslint-disable-next-line
export const signup = () => async (dispatch, getState) => {
  dispatch(txStart('Submitting token symbol registration...'))
  try {
    // TODO @bshevchenko: await SecurityTokenRegistrar.createTokenSymbol(getState().form[formName].values)
    // TODO @bshevchenko: getState().ui.history.push('/dashboard')
    await PolyToken.getTokens(200000)
    getState().ui.history.push('/')
  } catch (e) {
    dispatch(txFailed(e))
  }
}
