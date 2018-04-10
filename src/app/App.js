// @flow

import React, { Component } from 'react'
import Contract from 'polymathjs'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import { PolymathUI, txHash, txEnd } from 'polymath-ui'
import type { RouterHistory } from 'react-router-dom'

import Root from './Root'
import { isSignedUp } from './account/actions'
import type { RootState } from '../redux/reducer'

type StateProps = {|
  network: any,
|}

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  isSignedUp: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
})

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  isSignedUp,
}

type Props = {|
  route: Object,
  history: RouterHistory
|} & StateProps & DispatchProps

class App extends Component<Props> {

  componentWillMount () {
    Contract.setParams({
      ...this.props.network,
      txHashCallback: (hash) => this.props.txHash(hash),
      txEndCallback: (receipt) => this.props.txEnd(receipt),
    })
  }

  componentDidMount () {
    this.props.isSignedUp()
  }

  render () {
    return (
      <Root>
        <PolymathUI history={this.props.history} />
        {renderRoutes(this.props.route.routes)}
      </Root>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
