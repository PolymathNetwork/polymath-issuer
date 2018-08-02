// @flow

import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { Sidebar, icoBriefcase, icoInbox, icoHandshake, icoHelp, icoWhitelist } from 'polymath-ui'
import type { SecurityToken, Address } from 'polymathjs/types'

import { isProvidersPassed } from './providers/data'
import NotFoundPage from './NotFoundPage'
import { fetch as fetchToken } from './token/actions'
import { fetchProviders } from './providers/actions'
import type { RootState } from '../redux/reducer'
import type { ServiceProvider } from './providers/data'

type StateProps = {|
  token: ?SecurityToken,
  isTokenFetched: boolean,
  providers: ?Array<ServiceProvider>,
  account: Address,
|}

type DispatchProps = {|
  fetchToken: (ticker: string) => any,
  fetchProviders: (ticker: string) => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isTokenFetched: state.token.isFetched,
  providers: state.providers.data,
  account: state.network.account,
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
    const { isTokenFetched, providers, route, token, account } = this.props

    if (!isTokenFetched) { // TODO @bshevchenko: why is this here?
      return <span />
    }
    // $FlowFixMe
    if (isTokenFetched && (token === null || token.owner !== account)) {
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
        title: 'Compliance',
        icon: icoWhitelist,
        to: `${tokenUrl}/compliance`,
        isActive: location.slice(-11) === '/compliance',
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
