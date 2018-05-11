// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { change } from 'redux-form'
import { TxSuccess, bull } from 'polymath-ui'
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
import { data as tokenData } from '../token/actions'

type StateProps = {|
  account: ?string,
  token: Object,
  isSuccess: boolean
|}

type DispatchProps = {|
  change: (?string) => any,
  register: () => any,
  tokenData: (data: any) => any
|}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  isSuccess: state.pui.tx.success !== null,
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
  isModalOpen: boolean
|}

class TickerPage extends Component<Props, State> {

  state = {
    isModalOpen: false,
  }

  componentWillMount () {
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
    const { isSuccess } = this.props
    return (
      <DocumentTitle title='Token Symbol Registration – Polymath'>
        {isSuccess ? (
          <TxSuccess />
        ) : (
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
                    Once you hit &laquo;CONFIRM&raquo;, your Token Symbol
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
                <div className='pui-single-box-header-text'>
                  <h1 className='pui-h1'>Reserve Your Token Symbol</h1>
                  <h4 className='pui-h4'>
                    Your token symbol will be reserved for 15 days, and<br />
                    permanently yours once you create your Token.<br />
                    This reservation ensures that no other organization can use<br />
                    your brand or create an identical token symbol using the<br />
                    Polymath platform.
                  </h4>
                </div>
                <div className='pui-single-box-bull'>
                  <img src={bull} alt='Bull' />
                </div>
                <div className='pui-clearfix' />
              </div>
              <TickerForm onSubmit={this.handleSubmit} />
            </div>
          </Fragment>
        )}
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerPage)
