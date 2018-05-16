// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import 'normalize.css/normalize.css'

import RouteLoader from './RouteLoader'
import configureStore from './redux/store'
import serviceWorkerRegister from './registerServiceWorker'

serviceWorkerRegister()

// TODO @bshevchenko: remove this hotfix!
// eslint-disable-next-line
export const store = configureStore()

render(
  <Provider store={store}>
    <BrowserRouter>
      <RouteLoader />
    </BrowserRouter>
  </Provider>,
  ((document.getElementById('root'): any): HTMLElement)
)
