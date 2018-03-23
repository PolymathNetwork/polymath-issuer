// @flow

import App from './app/App'
import HomePage from './app/HomePage'
import NotFoundPage from './app/NotFoundPage'
import SignUpPage from './app/signup/SignUpPage'
import TokenPage from './app/dashboard/TokenPage'

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
        component: NotFoundPage,
      },
    ],
  },
]
