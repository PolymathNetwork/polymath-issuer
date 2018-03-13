import App from './app/App'
import HomePage from './app/HomePage'
import NotFoundPage from './app/NotFoundPage'

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
        component: NotFoundPage,
      },
    ],
  },
]
