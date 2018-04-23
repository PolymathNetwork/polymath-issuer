// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { change } from 'redux-form'
import { bull } from 'polymath-ui'
import type { RouterHistory } from 'react-router'

import TickerForm, { formName } from './components/TickerForm'
import { register } from './actions'
import { data as tokenData } from '../token/actions'

type StateProps = {|
  account: ?string,
  isSignedUp: boolean,
  token: Object,
|}

type DispatchProps = {|
  change: (?string) => any,
  register: () => any,
  tokenData: (data: any) => any,
|}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  isSignedUp: !!state.token.token,
  token: state.token.token,
})

const mapDispatchToProps: DispatchProps = {
  change: (value) => change(formName, 'owner', value, false, false),
  register,
  tokenData,
}

type Props = {|
  history: RouterHistory,
|} & StateProps & DispatchProps

class TickerPage extends Component<Props> {

  componentWillMount () {
    this.props.change(this.props.account)
    this.props.tokenData(null)
  }

  handleSubmit = () => {
    this.props.register()
  }

  render () {
    return (
      <DocumentTitle title='Token Symbol Registration – Polymath'>
        <div className='pui-single-box'>
          <div className='pui-single-box-header'>
            <div className='pui-single-box-header-text'>
              <h1 className='pui-h1'>Token symbol registration</h1>
              <h4 className='pui-h4'>
                The token symbol and name you choose will be stored on the Ethereum blockchain forever. It will
                also be listed on exchanges and other sites. Make sure you choose a symbol and name that helps
                investors recognize you.
              </h4>
            </div>
            <div className='pui-single-box-bull'>
              <img src={bull} alt='Bull' />
            </div>
            <div className='pui-clearfix' />
          </div>
          <TickerForm onSubmit={this.handleSubmit} />
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerPage)
