// @flow

import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
// eslint-disable-next-line no-unused-vars
import { Sidebar, icoBriefcase, icoInbox, icoHandshake, icoHelp, icoWhitelist } from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'

import { isProvidersPassed } from './providers/data'
import NotFoundPage from './NotFoundPage'
import { fetch as fetchToken } from './token/actions'
import { fetchProviders } from './providers/actions'
import type { RootState } from '../redux/reducer'
import type { ServiceProvider } from './providers/data'

type StateProps = {|
  token: ?SecurityToken,
  isTokenFetched: boolean,
  isAccountActivated: boolean,
  isAccountInitialized: boolean,
  providers: ?Array<ServiceProvider>,
|}

type DispatchProps = {|
  fetchToken: (ticker: string) => any,
  fetchProviders: (ticker: string) => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isTokenFetched: state.token.isFetched,
  isAccountInitialized: state.pui.account.isInitialized,
  isAccountActivated: state.pui.account.isActivated,
  providers: state.providers.data,
})

const mapDispatchToProps: DispatchProps = {
  fetchToken,
  fetchProviders,
}

type Props = {|
  route: Object,
  match: {
    params: {
      id: string
    }
  }
|} & StateProps & DispatchProps

class Dashboard extends Component<Props> {

  componentWillMount () {
    this.props.fetchToken(this.props.match.params.id)
    this.props.fetchProviders(this.props.match.params.id)
  }

  render () {
    const {
      isAccountActivated,
      isAccountInitialized,
      isTokenFetched,
      providers,
      route,
      token,
    } = this.props

    if (!isAccountInitialized || !isTokenFetched) {
      return <span />
    }

    if (!isAccountActivated) {
      // TickerSuccessPage decides whether to go to /ticker or /confirm-email.
      return <Redirect to='/ticker/success' />
    }

    if (isTokenFetched && token === null) {
      return <NotFoundPage />
    }

    // $FlowFixMe
    const ticker = token.ticker
    const tokenUrl = `/dashboard/${ticker}`
    const location = window.location.href
    const topSidebarItems = [
      {
        title: 'Providers',
        icon: icoHandshake,
        to: `${tokenUrl}/providers`,
        isActive: location.slice(-10) === '/providers',
        isDisabled: false,
      },
      {
        title: 'Token',
        icon: icoBriefcase,
        to: tokenUrl,
        isActive: location.slice(ticker.length * -1) === ticker,
        isDisabled: !isProvidersPassed(providers) && (!token || !token.address),
      },
      {
        title: 'STO',
        icon: icoInbox,
        to: `${tokenUrl}/sto`,
        isActive: location.slice(-4) === '/sto',
        isDisabled: !token || !token.address,
      },
      {
        title: 'Whitelist',
        icon: icoWhitelist,
        to: `${tokenUrl}/whitelist`,
        isActive: location.slice(-10) === '/whitelist',
        isDisabled: !token || !token.address,
      },
    ]
    const bottomSidebarItems = [
      // {
      //   title: 'FAQ',
      //   icon: icoHelp,
      //   to: '#',
      //   isActive: false,
      // },
    ]
    return (
      <div className='dashboard'>
        <Sidebar topItems={topSidebarItems} bottomItems={bottomSidebarItems} />
        {renderRoutes(route.routes)}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
