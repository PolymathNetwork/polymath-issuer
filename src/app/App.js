// @flow

import React, { Component } from 'react'
import Contract from 'polymath.js_v2'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import { PolymathUI, txHash, txEnd } from 'polymath-ui'
import type { RouterHistory } from 'react-router-dom'

import 'carbon-components/css/carbon-components.min.css'
import 'polymath-ui/dist/style.css'
import './style.css'

import { fetch as fetchToken } from './token/actions'
import type { RootState } from '../redux/reducer'

type StateProps = {|
  network: any,
  isTokenFetched: boolean,
|}

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  fetchToken: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isTokenFetched: state.token.isFetched,
})

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  fetchToken,
}

type Props = {|
  route: Object,
  history: RouterHistory
|} & StateProps & DispatchProps

class App extends Component<Props> {

  componentWillMount () {
    Contract.params = {
      ...this.props.network,
      txHashCallback: (hash) => this.props.txHash(hash),
      txEndCallback: (receipt) => this.props.txEnd(receipt),
    }
  }

  componentDidMount () {
    this.props.fetchToken()
  }

  render () {
    return (
      <div>
        <PolymathUI history={this.props.history} />
        <div className='bx--grid'>
          {this.props.isTokenFetched ? renderRoutes(this.props.route.routes) : ''}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
