// @flow

import App from './app/App'
import NotFoundPage from './app/NotFoundPage'
import WhitelistPage from './app/compliance/CompliancePage'
import TickerPage from './app/ticker/TickerPage'
import Dashboard from './app/Dashboard'
import ProvidersPage from './app/providers/ProvidersPage'
import TokenPage from './app/token/TokenPage'
import STOPage from './app/sto/STOPage'

export default [
  {
    component: App,
    routes: [
      {
        path: '/ticker',
        component: TickerPage,
        exact: true,
      },
      {
        path: '/dashboard/:id',
        component: Dashboard,
        routes: [
          {
            path: '/dashboard/:id/providers',
            component: ProvidersPage,
            exact: true,
          },
          {
            path: '/dashboard/:id',
            component: TokenPage,
            exact: true,
          },
          {
            path: '/dashboard/:id/sto',
            component: STOPage,
            exact: true,
          },
          {
            path: '/dashboard/:id/compliance',
            component: WhitelistPage,
            exact: true,
          },
          {
            component: NotFoundPage,
          },
        ],
      },
      {
        component: NotFoundPage,
      },
    ],
  },
]
