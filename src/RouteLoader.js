// @flow

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Loading } from 'carbon-components-react'
import PolymathAuth, { NETWORK_MAIN, NETWORK_KOVAN } from 'polymath-auth'
import { MetamaskPage, DummyPage } from 'polymath-ui'
import { isMobile } from 'react-device-detect'

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
    if (isMobile) {
      return (
        <Root>
          <DummyPage />
        </Root>
      )
    } else if (this.props.location.pathname === '/') {
      // noinspection RequiredAttributes
      return (
        <Root>
          <SplashPage />
        </Root>
      )
    }
    const networks = [
      NETWORK_MAIN,
      NETWORK_KOVAN,
    ]
    return (
      <PolymathAuth loading={<Loading />} guide={<MetamaskPage networks='Mainnet or Kovan' />} networks={networks}>
        {renderRoutes(routes)}
      </PolymathAuth>
    )
  }
}

export default withRouter(RouteLoader)
