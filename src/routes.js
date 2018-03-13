import App from './app/App'
import HomePage from './app/HomePage'
import NotFoundPage from './app/NotFoundPage'
import SignUpPage from './app/signup/SignUpPage'

// TODO @bshevchenko: from asana
// /index (splash/ landing)
// /signup (Symbol registration)
// /dashboard (dashboard main screen)
// /dashboard/token
// /dashboard/sto
// /dashboard/whitelist

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
        component: NotFoundPage,
      },
    ],
  },
]
