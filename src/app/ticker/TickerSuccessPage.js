// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Loading } from 'carbon-components-react'

import { initSuccessPage, sendRegisterTickerEmail } from './actions'
import type { TickerTransaction } from './reducer'

type StateProps = {|
  isAccountInitialized: boolean,
  isAccountActivated: boolean,
  isSuccessPageInitialized: boolean,
  transaction: TickerTransaction,
|}

type DispatchProps = {|
  initSuccessPage: () => mixed,
  sendRegisterTickerEmail: () => mixed,
|}

const mapStateToProps = (state): StateProps => ({
  isAccountInitialized: state.pui.account.isInitialized,
  isAccountActivated: state.pui.account.isActivated,
  isSuccessPageInitialized: state.ticker.isSuccessPageInitialized,
  transaction: state.ticker.transaction,
})

const mapDispatchToProps: DispatchProps = {
  initSuccessPage,
  sendRegisterTickerEmail,
}

type Props = {|
  location: {
    state?: {
      fromEmailConfirmation?: boolean,
    }
  }
|} & StateProps & DispatchProps

class TickerSuccessPage extends Component<Props> {

  componentWillMount () {
    this.props.initSuccessPage()
  }

  render () {
    const {
      transaction,
      isAccountActivated,
      isAccountInitialized,
      isSuccessPageInitialized,
    } = this.props

    if (!isSuccessPageInitialized || !isAccountInitialized) {
      return <Loading />
    }

    if (!isAccountActivated || !transaction) {
      return <Redirect to='/confirm-email' />
    }

    this.props.sendRegisterTickerEmail()

    return <Redirect to={`/dashboard/${transaction.ticker}/providers`} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerSuccessPage)
