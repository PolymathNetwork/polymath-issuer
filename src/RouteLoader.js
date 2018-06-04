// @flow

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Loading } from 'carbon-components-react'
import PolymathAuth, { NETWORK_RINKEBY } from 'polymath-auth'
import { MetamaskPage } from 'polymath-ui'

import Root from './app/Root'
import SplashPage from './app/SplashPage'
import DummyPage from './app/DummyPage'
import routes from './routes'

type Props = {
  location: {
    pathname: string,
    [any]: any,
  },
}

type State = {|
  screen_width: number,
|}

class RouteLoader extends Component<Props, State> {
  constructor () {
    super()
    this.state = {
      screen_width: window.innerWidth,
    }
  }
  componentWillMount () {
    window.addEventListener('resize', this.handleWindowSizeChange)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleWindowSizeChange)
  }

  handleWindowSizeChange = () => {
    this.setState({ screen_width: window.innerWidth })
  }

  render () {
    const { screen_width } = this.state
    const isMobile = screen_width <= 768
    if (isMobile || typeof window.orientation !== 'undefined') {
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
    const networks = [ NETWORK_RINKEBY ]
    return (
      <PolymathAuth loading={<Loading />} guide={<MetamaskPage networks='Rinkeby' />} networks={networks}>
        {renderRoutes(routes)}
      </PolymathAuth>
    )
  }
}

export default withRouter(RouteLoader)
