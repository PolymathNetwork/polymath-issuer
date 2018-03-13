import { combineReducers } from 'redux'
import { reducer as reduxForm } from 'redux-form'
import { reducers as authReducers } from 'polymath-auth'
import ui from '../app/ui/reducer'

export default combineReducers({
  ...authReducers,
  form: reduxForm,
  ui,
})
