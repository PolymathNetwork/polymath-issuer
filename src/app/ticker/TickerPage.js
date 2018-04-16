// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import type { RouterHistory } from 'react-router'
import { bull } from 'polymath-ui'

import TickerForm from './components/TickerForm'
import { register } from './actions'

type StateProps = {|
  account: ?string,
  isSignedUp: boolean,
  token: Object,
|}

type DispatchProps = {|
  register: () => any,
|}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  isSignedUp: !!state.token.token,
  token: state.token.token,
})

const mapDispatchToProps: DispatchProps = {
  register,
}

type Props = {|
  history: RouterHistory,
|} & StateProps & DispatchProps

class TickerPage extends Component<Props> {

  handleSubmit = () => {
    this.props.register()
  }

  render () {
    return (
      <DocumentTitle title='Token Symbol Registration – Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-2' />
          <div className='bx--col-xs-8'>
            <div className='pui-single-box'>
              <div className='bx--row'>
                <div className='bx--col-xs-8'>
                  <h1>Token symbol registration</h1>
                  <h4>
                    The token symbol and name you choose will be stored on the Ethereum blockchain forever. It will
                    also be listed on exchanges and other sites. Make sure you choose a symbol and name that helps
                    investors recognize you.
                  </h4>
                </div>
                <div className='bx--col-xs-4 pui-single-box-bull'>
                  <img src={bull} alt='Bull' />
                </div>
              </div>
              <div className='bx--row'>
                <div className='bx--col-xs-12'>
                  <TickerForm onSubmit={this.handleSubmit} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerPage)
