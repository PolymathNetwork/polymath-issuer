import React  from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import PolymathAuth from 'polymath-auth'

import 'normalize.css/normalize.css'

import RouteLoader from './RouteLoader'
import configureStore from './redux/store'
import serviceWorkerRegister from './registerServiceWorker'

serviceWorkerRegister()

const store = configureStore()

render(
  <Provider store={store}>
    <PolymathAuth>
      <BrowserRouter>
        <RouteLoader />
      </BrowserRouter>
    </PolymathAuth>
  </Provider>,
  document.getElementById('root')
)
