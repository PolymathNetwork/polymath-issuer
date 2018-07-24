// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import 'normalize.css/normalize.css'

import RouteLoader from './RouteLoader'
import configureStore from './redux/store'
import { unregister } from './registerServiceWorker'

unregister()

const store = configureStore()

render(
  <Provider store={store}>
    <BrowserRouter>
      <RouteLoader />
    </BrowserRouter>
  </Provider>,
  ((document.getElementById('root'): any): HTMLElement)
)
