// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { change } from 'redux-form'
import { bull } from 'polymath-ui'
import BigNumber from 'bignumber.js'
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
import { reserve, expiryLimit, faucet } from './actions'
import { data as tokenData } from '../token/actions'

type StateProps = {|
  account: ?string,
    token: Object,
      networkName: string,
        polyBalance: BigNumber,
          expiryLimit: number
            |}

type DispatchProps = {|
  change: (? string) => any,
    reserve: () => any,
      tokenData: (data: any) => any,
        faucet: (? string, number) => any,
          getExpiryLimit: () => any
            |}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  networkName: state.network.name,
  polyBalance: state.pui.account.balance,
  expiryLimit: state.ticker.expiryLimit,
})

const mapDispatchToProps: DispatchProps = {
  change: (value) => change(formName, 'owner', value, false, false),
  reserve,
  tokenData,
  faucet,
  getExpiryLimit: expiryLimit,
}

type Props = {|
  history: RouterHistory
    |} & StateProps & DispatchProps

type State = {|
  isConfirmationModalOpen: boolean,
    isNotEnoughPolyModalOpen: boolean,
      polyCost: number
        |}

class TickerPage extends Component<Props, State> {

  state = {
    isConfirmationModalOpen: false,
    isNotEnoughPolyModalOpen: false,
    polyCost: 2500,
  }

  componentWillMount () {
    this.props.change(this.props.account)
    this.props.tokenData(null)
    this.props.getExpiryLimit()
  }

  handleSubmit = () => {
    this.setState({ isConfirmationModalOpen: true })
  }

  handleConfirm = () => {
    this.setState({ isConfirmationModalOpen: false })
    if (this.props.polyBalance < this.state.polyCost) {
      this.setState({ isNotEnoughPolyModalOpen: true })
    } else {
      this.props.reserve()
    }
  }

  handleConfirmationCancel = () => {
    this.setState({ isConfirmationModalOpen: false })
  }

  handleNotEnoughPolyCancel = () => {
    this.setState({ isNotEnoughPolyModalOpen: false })
  }

  handleFaucetRequest =  () => {
    this.setState({ isNotEnoughPolyModalOpen: false })
    this.props.faucet(this.props.account, 1)
  }

  render () {
    return (
      <DocumentTitle title='Token Symbol Reservation – Polymath'>
        <Fragment>
          <ComposedModal open={this.state.isConfirmationModalOpen} className='pui-confirm-modal'>
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
              <Button kind='secondary' onClick={this.handleConfirmationCancel}>
                Cancel
              </Button>
              <Button onClick={this.handleConfirm}>Reserve Ticker</Button>
            </ModalFooter>
          </ComposedModal>
          <ComposedModal
            open={this.state.isNotEnoughPolyModalOpen && this.props.networkName === 'Kovan Testnet'}
            className='pui-confirm-modal'
          >
            <ModalHeader
              label='Transaction Impossible'
              title={(
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                  Insufficient POLY Balance
                </span>
              )}
            />

            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  The registration of a token symbol has a fixed cost of {this.state.polyCost} POLY.
                  Please make sure that your wallet has a sufficient balance in
                  POLY to complete this operation.
                </p>

                <p>
                  You are currently connected to the <span style={{ fontWeight: 'bold' }}>Kovan Test Network</span>.
                </p>

                <p>
                  As such, you can click on the &laquo;REQUEST 25K POLY&raquo; button below to
                   receive 25,000 test POLY in your wallet.
                </p>
                <br />
                <div className='pui-remark'>
                  <div className='pui-remark-title'>Note</div>
                  <div className='pui-remark-text'>This option is not available on
                    <span style={{ fontWeight: 'bold' }}>
                      Main Network.
                    </span>
                  </div>
                </div>

              </div>
            </ModalBody>
            <ModalFooter>
              <Button kind='secondary' onClick={this.handleNotEnoughPolyCancel}>
                Cancel
              </Button>
              <Button onClick={this.handleFaucetRequest}>REQUEST 25k POLY</Button>
            </ModalFooter>
          </ComposedModal>
          <ComposedModal
            open={this.state.isNotEnoughPolyModalOpen && this.props.networkName === 'Ethereum Mainnet'}
            className='pui-confirm-modal'
          >
            <ModalHeader
              label='Transaction Impossible'
              title={(
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                  Insufficient POLY Balance
                </span>
              )}
            />

            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  The registration of a token symbol has a fixed cost of {this.state.polyCost} POLY.
                  Please make sure that your wallet has a sufficient balance in
                  POLY to complete this operation.
                </p>
                <p>
                  If you need to obtain POLY tokens, you can visit &nbsp; 
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://shapeshift.io'
                  >here
                  </a> or
                  obtain more information &nbsp;
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://etherscan.io/token/0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec#tokenExchange'
                  >here
                  </a>
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleNotEnoughPolyCancel}>
                Close
              </Button>
            </ModalFooter>
          </ComposedModal>
          <div className='pui-single-box'>
            <div className='pui-single-box-header'>
              <div className='pui-single-box-bull'>
                <img src={bull} alt='Bull' />
              </div>
              <h1 className='pui-h1'>Reserve Your Token Symbol</h1>
              <h4 className='pui-h4'>
                Your token symbol will be reserved for {this.props.expiryLimit} days, and
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
