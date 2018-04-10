// @flow

import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import type { SecurityToken } from 'polymathjs/types'

import NotFoundPage from './NotFoundPage'
import { fetch as fetchToken } from './token/actions'
import type { RootState } from '../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  isTokenFetched: boolean,
|}

type DispatchProps = {|
  fetchToken: (ticker: string) => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isTokenFetched: state.token.isFetched,
})

const mapDispatchToProps: DispatchProps = {
  fetchToken,
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
  }

  render () {
    const { token, isTokenFetched, route } = this.props
    if (isTokenFetched && token === null) {
      return <NotFoundPage />
    }
    if (!isTokenFetched) {
      return <span />
    }
    return renderRoutes(route.routes)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
