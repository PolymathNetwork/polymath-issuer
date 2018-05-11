// @flow

import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { Sidebar, icoBriefcase, icoInbox, icoHandshake, icoHelp, icoWhitelist } from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'

import NotFoundPage from './NotFoundPage'
import { fetch as fetchToken } from './token/actions'
import { fetchProviders } from './providers/actions'
import type { RootState } from '../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  isTokenFetched: boolean,
|}

type DispatchProps = {|
  fetchToken: (ticker: string) => any,
  fetchProviders: (ticker: string) => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isTokenFetched: state.token.isFetched,
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
    const { token, isTokenFetched, route } = this.props
    if (isTokenFetched && token === null) {
      return <NotFoundPage />
    }
    if (!isTokenFetched) {
      return <span />
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
      },
      {
        title: 'Token',
        icon: icoBriefcase,
        to: tokenUrl,
        isActive: location.slice(ticker.length * -1) === ticker,
      },
      {
        title: 'STO',
        icon: icoInbox,
        to: `${tokenUrl}/sto`,
        isActive: location.slice(-4) === '/sto',
      },
      {
        title: 'Whitelist',
        icon: icoWhitelist,
        to: `${tokenUrl}/whitelist`,
        isActive: location.slice(-10) === '/whitelist',
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
