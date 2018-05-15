// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { change } from 'redux-form'
import { bull } from 'polymath-ui'
import { Redirect } from 'react-router'
import { TickerRegistry } from 'polymathjs'
import type { RouterHistory } from 'react-router'
import {
  Button,
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Icon,
} from 'carbon-components-react'

import TickerForm, { formName } from './components/TickerForm'
import { register } from './actions'
import type { TickerTransaction } from './reducer'
import { data as tokenData } from '../token/actions'

type StateProps = {|
  account: ?string,
  token: Object,
  isRegistered: boolean,
  transaction: TickerTransaction,
|}

type DispatchProps = {|
  change: (?string) => any,
  register: () => any,
  tokenData: (data: any) => any
|}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  isRegistered: state.ticker.isRegistered,
  transaction: state.ticker.transaction,
})

const mapDispatchToProps: DispatchProps = {
  change: (value) => change(formName, 'owner', value, false, false),
  register,
  tokenData,
}

type Props = {|
  history: RouterHistory
|} & StateProps & DispatchProps

type State = {|
  isModalOpen: boolean,
  expiryLimit: number,
|}

class TickerPage extends Component<Props, State> {

  state = {
    isModalOpen: false,
    expiryLimit: 7,
  }

  componentWillMount () {
    // TODO @bshevchenko: probably we shouldn't call polymath.js directly from the components
    TickerRegistry.expiryLimit().then((expiryLimit) => {
      this.setState({ expiryLimit: expiryLimit / 24 / 60 / 60 })
    })
    this.props.change(this.props.account)
    this.props.tokenData(null)
  }

  handleSubmit = () => {
    this.setState({ isModalOpen: true })
  }

  handleConfirm = () => {
    this.setState({ isModalOpen: false })
    this.props.register()
  }

  handleCancel = () => {
    this.setState({ isModalOpen: false })
  }

  render () {
    if (this.props.isRegistered) {
      return <Redirect to='/ticker/success' />
    }

    return (
      <DocumentTitle title='Token Symbol Registration – Polymath'>
        <Fragment>
          <ComposedModal open={this.state.isModalOpen} className='pui-confirm-modal'>
            <ModalHeader
              label='Confirmation required'
              title={(
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                  Before You Proceed with Your Token Symbol Reservation
                </span>
              )}
            />
            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  Please confirm that all previous information is correct and that you are not
                  violating any trademarks.
                </p>
                <p>
                  Once you hit &laquo;RESERVE TICKER&raquo;, your Token Symbol
                  reservation will be sent to the blockchain and will be
                  immutable. Any change will require that you start the process
                  over. If you wish to review your information, please select
                  &laquo;CANCEL&raquo;.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button kind='secondary' onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button onClick={this.handleConfirm}>Reserve Ticker</Button>
            </ModalFooter>
          </ComposedModal>
          <div className='pui-single-box'>
            <div className='pui-single-box-header'>
              <div className='pui-single-box-bull' style={{ height: '200px' }}>
                <img src={bull} alt='Bull' />
              </div>
              <h1 className='pui-h1'>Reserve Your Token Symbol</h1>
              <h4 className='pui-h4'>
                Your token symbol will be reserved for {this.state.expiryLimit} days, and
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
