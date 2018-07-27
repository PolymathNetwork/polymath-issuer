// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { change } from 'redux-form'
import { bull } from 'polymath-ui'
import type { RouterHistory } from 'react-router'

import TickerForm, { formName } from './components/TickerForm'
import { reserve, expiryLimit } from './actions'
import { data as tokenData } from '../token/actions'

type StateProps = {|
  account: ?string,
  token: Object,
  expiryLimit: number
|}

type DispatchProps = {|
  change: (?string) => any,
  reserve: () => any,
  tokenData: (data: any) => any,
  getExpiryLimit: () => any,
|}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  expiryLimit: state.ticker.expiryLimit,
})

const mapDispatchToProps: DispatchProps = {
  change: (value) => change(formName, 'owner', value, false, false),
  reserve,
  tokenData,
  getExpiryLimit: expiryLimit,
}

type Props = {|
  history: RouterHistory
|} & StateProps & DispatchProps

class TickerPage extends Component<Props> {

  componentWillMount () {
    this.props.change(this.props.account)
    this.props.tokenData(null)
    this.props.getExpiryLimit()
  }

  handleSubmit = () => {
    this.props.reserve()
  }

  render () {
    return (
      <DocumentTitle title='Token Symbol Reservation – Polymath'>
        <Fragment>
          <div className='pui-single-box'>
            <div className='pui-single-box-header'>
              <div className='pui-single-box-bull'>
                <img src={bull} alt='Bull' />
              </div>
              <h1 className='pui-h1'>Reserve Your Token Symbol</h1>
              <h4 className='pui-h4'>
                If your organization has a CUSIP number, please enter the 5-letter symbol assigned to you by FINRA.
                Otherwise, please enter your desired token symbol provided that
                 it does not infringe on registered trademarks.
                Your token symbol will be reserved for {this.props.expiryLimit} days, and is
                permanently yours once you create your Token.<br />
                This reservation ensures that no other organization can use
                your brand or create an identical token symbol using the
                Polymath platform.
              </h4>
              <div className='pui-clearfix' />
            </div>
            <TickerForm onSubmit={this.handleSubmit} />
          </div>
        </Fragment>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerPage)
