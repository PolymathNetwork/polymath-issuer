// @flow
import React, { Component } from 'react'
import Contract from 'polymathjs'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import { PolymathUI, SignUpPage, SignInPage, SignUpSuccessPage, signIn, txHash, txEnd, getNotice } from 'polymath-ui'
import type { RouterHistory } from 'react-router-dom'

import Root from './Root'
import ConfirmEmailPage from './ConfirmEmailPage'
import { getMyTokens, tickerReservationEmail } from './ticker/actions'
import type { RootState } from '../redux/reducer'

type StateProps = {|
  network: any,
  isSignedIn: ?boolean,
  isSignedUp: ?boolean,
  isTickerReserved: ?boolean,
  isEmailConfirmed: ?boolean,
  isSignUpSuccess: boolean,
  ticker: ?string,
|}

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  signIn: () => any,
  getMyTokens: () => any,
  getNotice: (scope: string) => any,
  tickerReservationEmail: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isSignedIn: state.pui.account.isSignedIn,
  isSignedUp: state.pui.account.isSignedUp,
  isTickerReserved: state.ticker.isTickerReserved,
  isEmailConfirmed: state.pui.account.isEmailConfirmed,
  isSignUpSuccess: state.pui.account.isEnterPINSuccess,
  ticker: state.token.token ? state.token.token.ticker : null,
})

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  signIn,
  getMyTokens,
  getNotice,
  tickerReservationEmail,
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
    this.props.getMyTokens()
    this.props.getNotice('issuers')
  }

  componentDidMount () {
    this.props.signIn()
  }

  handleSignUpSuccess = () => {
    this.props.tickerReservationEmail()
  }

  render () {

    const { history, ticker, isSignedIn, isSignedUp, isTickerReserved, isEmailConfirmed, isSignUpSuccess } = this.props
    return (
      <Root>
        <PolymathUI history={history} ticker={ticker} />
        {!isSignedIn ? <SignInPage /> : (
          !isSignedUp ? <SignUpPage /> : (
            isTickerReserved && !isEmailConfirmed ? (
              isSignUpSuccess ?
                <SignUpSuccessPage
                  text={
                    <span>
                      You are now ready to continue with your Security Token.<br />
                      We just sent you an email with the token symbol reservation transaction details for your records.
                      Check your inbox.
                    </span>
                  }
                  continueLabel='CONTINUE WITH TOKEN CREATION'
                  onWillMount={this.handleSignUpSuccess}
                /> :
                <ConfirmEmailPage />
            )
              : renderRoutes(this.props.route.routes)
          )
        )}
      </Root>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
