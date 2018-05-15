// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Redirect } from 'react-router'
import { TxSuccess } from 'polymath-ui'

import { initSuccessPage, sendRegisterTickerEmail } from './actions'

type StateProps = {|
  isAccountInitialized: boolean,
  isAccountActivated: boolean,
  isSuccessPageInitialized: boolean,
  transaction: boolean,
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

  componentDidUpdate () {
    const props = this.props
    const locationState = props.location.state

    if (props.isAccountInitialized && props.isAccountActivated &&
      props.isSuccessPageInitialized && props.transaction && locationState &&
      locationState.fromEmailConfirmation) {
      props.sendRegisterTickerEmail()
    }
  }

  render () {
    const {
      transaction,
      isAccountActivated,
      isAccountInitialized,
      isSuccessPageInitialized,
    } = this.props

    if (!isSuccessPageInitialized || !isAccountInitialized) {
      return <span />
    }

    if (!isAccountActivated || !transaction) {
      return <Redirect to='/confirm-email' />
    }

    return (
      <DocumentTitle title='Token Symbol Registration – Polymath'>
        { /* $FlowFixMe */ }
        <TxSuccess />
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerSuccessPage)
