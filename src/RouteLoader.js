// @flow

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Loading } from 'carbon-components-react'
import PolymathAuth, { NETWORK_KOVAN } from 'polymath-auth'
import { MetamaskPage } from 'polymath-ui'

import Root from './app/Root'
import SplashPage from './app/SplashPage'
import DummyPage from './app/DummyPage'
import TermsOfUsePage from './app/terms/TermsOfUsePage'
import PrivacyPolicyPage from './app/terms/PrivacyPage'
import routes from './routes'

type Props = {
  location: {
    pathname: string,
    [any]: any,
  },
}

type State = {|
  screenWidth: number,
|}

class RouteLoader extends Component<Props, State> {
  constructor () {
    super()
    this.state = {
      screenWidth: window.innerWidth,
    }
  }

  componentWillMount () {
    window.addEventListener('resize', this.handleWindowSizeChange)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleWindowSizeChange)
  }

  handleWindowSizeChange = () => {
    this.setState({ screenWidth: window.innerWidth })
  }

  checkIfMobile = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      return true
    } else {
      return false
    }
  }

  render () {
    const { screenWidth } = this.state

    const isMobile = this.checkIfMobile()

    if (isMobile || screenWidth < 1024) {
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
    } else if (this.props.location.pathname === '/termsofuse') {
      return (
        <Root>
          <TermsOfUsePage />
        </Root>
      )
    } else if (this.props.location.pathname === '/privacypolicy') {
      return (
        <Root>
          <PrivacyPolicyPage />
        </Root>
      )
    }
    const networks = [NETWORK_KOVAN]
    return (
      <PolymathAuth loading={<Loading />} guide={<MetamaskPage networks='Rinkeby' />} networks={networks}>
        {renderRoutes(routes)}
      </PolymathAuth>
    )
  }
}

export default withRouter(RouteLoader)
