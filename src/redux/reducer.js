// @flow

import { combineReducers } from 'redux'
import { reducer as reduxForm } from 'redux-form'
import { reducers as authReducers } from 'polymath-auth'
import { puiReducer } from 'polymath-ui'

import ui from '../app/ui/reducer'
import dashboard from '../app/dashboard/reducer'

export default combineReducers({
  ...authReducers,
  form: reduxForm,
  ui,
  dashboard,
  pui: puiReducer,
})
