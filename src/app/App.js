// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'
import Contract from 'polymathjs'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import { PolymathUI, txHash, txEnd } from 'polymath-ui'
import type { RouterHistory } from 'react-router-dom'

import Root from './Root'
import SignUpPage from './account/SignUpPage'
import { init as initAccount } from './account/actions'
import type { RootState } from '../redux/reducer'

type StateProps = {|
  network: any,
  isSignedUp: ?boolean,
  balance: ?BigNumber,
  ticker: ?string,
|}

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  initAccount: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isSignedUp: state.account.isSignedUp,
  balance: state.account.balance,
  ticker: state.token.token ? state.token.token.ticker : null,
})

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  initAccount,
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
    this.props.initAccount()
  }

  render () {
    const { history, balance, ticker, isSignedUp } = this.props
    return (
      <Root>
        <PolymathUI history={history} balance={balance} ticker={ticker} />
        {isSignedUp ? renderRoutes(this.props.route.routes) : <SignUpPage />}
      </Root>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
