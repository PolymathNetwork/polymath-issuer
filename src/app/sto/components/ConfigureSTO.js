// @flow

import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import {
  Button,
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Icon,
} from 'carbon-components-react'
import type { SecurityToken, STOFactory } from 'polymathjs/types'
import BigNumber from 'bignumber.js'

import NotFoundPage from '../../NotFoundPage'
import STODetails from './STODetails'
import ConfigureSTOForm from './ConfigureSTOForm'
import { configure, goBack, faucet } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  account: ?string,
  token: ?SecurityToken,
  factory: ?STOFactory,
  networkName: string,
  polyBalance: BigNumber
|}

type DispatchProps = {|
  configure: (number) => any,
  goBack: () => any,
  faucet: (?string, number) => any
|}

const mapStateToProps = (state: RootState): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  factory: state.sto.factory,
  networkName: state.network.name,
  polyBalance: state.pui.account.balance,
})

const mapDispatchToProps: DispatchProps = {
  configure,
  goBack,
  faucet,
}

type Props = {||} & StateProps & DispatchProps

type State = {|
  isConfirmationModalOpen: boolean,
  isNotEnoughPolyModalOpen: boolean,
  polyCost: number
|}

class ConfigureSTO extends Component<Props, State> {

  state = {
    isConfirmationModalOpen: false,
    isNotEnoughPolyModalOpen: false,
    polyCost: 20000,
  }

  handleCompleteSubmit = () => {
    this.setState({ isConfirmationModalOpen: true })
  }

  handleGoBack = () => {
    this.props.goBack()
  }

  handleConfirm = () => {
    this.setState({ isConfirmationModalOpen: false })
    if (this.props.polyBalance < this.state.polyCost) {
      this.setState({ isNotEnoughPolyModalOpen: true })
    } else {
      this.props.configure(this.state.polyCost)
    }
  }

  handleConfirmationCancel = () => {
    this.setState({ isConfirmationModalOpen: false })
  }

  handleNotEnoughPolyCancel = () => {
    this.setState({ isNotEnoughPolyModalOpen: false })
  }

  handleFaucetRequest = () => {
    this.setState({ isNotEnoughPolyModalOpen: false })
    this.props.faucet(this.props.account, 25000)
  }

  render () {
    const { token, factory } = this.props
    if (!token || !token.address || !factory) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`Configure ${token.ticker} STO – Polymath`}>
        <div>
          <div className='bx--row'>
            <div className='bx--col-xs-12'>
              <ComposedModal open={this.state.isConfirmationModalOpen} className='pui-confirm-modal'>
                <ModalHeader
                  label='Confirmation required'
                  title={(
                    <span>
                      <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                      Before You Launch Your Security Token Offering
                    </span>
                  )}
                />
                <ModalBody>
                  <div className='bx--modal-content__text'>
                    <p>
                      Once submitted to the blockchain, the dates for your
                      offering cannot be changed.
                    </p>
                    <p>
                      Please confirm dates with your Advisor and Legal
                      providers before you click on &laquo;LAUNCH&raquo;.
                    </p>
                    <p>
                      Investors must be added to the whitelist before or while
                      the STO is live, so they can participate to your
                      fundraise.
                    </p>
                    <p>
                      All necessary documentation must be posted on your
                      Securities Offering Site.
                    </p>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button kind='secondary' onClick={this.handleConfirmationCancel}>
                    Cancel
                  </Button>
                  <Button onClick={this.handleConfirm}>LAUNCH</Button>
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

              <Button
                kind='ghost'
                onClick={this.handleGoBack}
                className='pui-go-back'
                icon='arrow--left'
              >
                Go back
              </Button>
              <h1 className='pui-h1'>Security Token Offering Configuration</h1>
              <br />
              <div className='bx--row'>
                <div className='bx--col-xs-5'>
                  <div className='pui-page-box'>
                    <h2 className='pui-h2'>
                      Simple Capped Offering
                    </h2>
                    <h4 className='pui-h4' style={{ marginBottom: '15px' }}>
                      Provide the financial details and timing for your offering below.
                    </h4>
                    <ConfigureSTOForm onSubmit={this.handleCompleteSubmit} />
                  </div>
                </div>
                <div className='bx--col-xs-7'>
                  <STODetails item={factory} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureSTO)
