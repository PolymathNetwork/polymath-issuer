// @flow

import { compose, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import type { RootState } from './state.types'
import reducer from './reducer'

const composedStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f,
)(createStore)

const configureStore = (initialState?: RootState) => composedStore(reducer, initialState)

export default configureStore
