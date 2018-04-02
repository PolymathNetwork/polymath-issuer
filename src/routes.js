// @flow

import App from './app/App'
import HomePage from './app/HomePage'
import NotFoundPage from './app/NotFoundPage'
import SignUpPage from './app/signup/SignUpPage'
import TokenPage from './app/token/TokenPage'
import STOPage from './app/sto/STOPage'

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        component: HomePage,
        exact: true,
      },
      {
        path: '/signup',
        component: SignUpPage,
        exact: true,
      },
      {
        path: '/dashboard',
        component: TokenPage,
        exact: true,
      },
      {
        path: '/dashboard/sto',
        component: STOPage,
        exact: true,
      },
      {
        component: NotFoundPage,
      },
    ],
  },
]
