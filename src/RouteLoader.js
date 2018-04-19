// @flow

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import PolymathAuth from 'polymath-auth'

import Root from './app/Root'
import SplashPage from './app/SplashPage'
import routes from './routes'

type Props = {
  location: {
    pathname: string,
    [any]: any
  }
}

class RouteLoader extends Component<Props> {
  render () {
    if (this.props.location.pathname === '/') {
      return (
        <Root>
          <SplashPage />
        </Root>
      )
    }
    return (
      <PolymathAuth>
        {renderRoutes(routes)}
      </PolymathAuth>
    )
  }
}

export default withRouter(RouteLoader)
