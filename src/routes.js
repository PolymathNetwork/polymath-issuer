// @flow

import App from './app/App'
import NotFoundPage from './app/NotFoundPage'
import ConfirmEmailPage from './app/ticker/ConfirmEmailPage'
import EmailConfirmedPage from './app/EmailConfirmedPage'
import WhitelistPage from './app/whitelist/WhitelistPage'
import TickerPage from './app/ticker/TickerPage'
import TickerSuccessPage from './app/ticker/TickerSuccessPage'
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
        path: '/confirm-email',
        component: ConfirmEmailPage,
        exact: true,
      },
      {
        path: '/email-confirmed',
        component: EmailConfirmedPage,
        exact: true,
      },
      {
        path: '/ticker/success',
        component: TickerSuccessPage,
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
            path: '/dashboard/:id/whitelist',
            component: WhitelistPage,
            exact: true,
          },
        ],
      },
      {
        component: NotFoundPage,
      },
    ],
  },
]
