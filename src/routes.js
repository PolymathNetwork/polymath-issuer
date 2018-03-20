import App from './app/App'
import HomePage from './app/HomePage'
import NotFoundPage from './app/NotFoundPage'
import SignUpPage from './app/signup/SignUpPage'
import DashboardPage from './app/dashboard/DashboardPage'
import TokenPage from './app/dashboard/TokenPage'
import WhitelistPage from './app/dashboard/whitelist/WhiteListPage'

// TODO @bshevchenko: from asana
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
        path: '/dashboard',
        component: DashboardPage,
        exact: true,
      },
      {
        path: '/dashboard/token/:id',
        component: TokenPage,
        exact: true,
      },
      {
        path: '/dashboard/whitelist',
        component: WhitelistPage,
        exact: true,
      },
      {
        component: NotFoundPage,
      },
    ],
  },
]
