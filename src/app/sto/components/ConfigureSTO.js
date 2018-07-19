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
import BigNumber from 'bignumber.js'
import { Remark } from 'polymath-ui'
import type { SecurityToken, STOFactory, Address } from 'polymathjs/types'

import NotFoundPage from '../../NotFoundPage'
import STODetails from './STODetails'
import ConfigureSTOForm from './ConfigureSTOForm'
import { configure, goBack, faucet, getPolyFee } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  account: ?string,
  token: ?SecurityToken,
  factory: ?STOFactory,
  networkName: string,
  polyBalance: BigNumber
|}

type DispatchProps = {|
  configure: (number, Address) => any,
  goBack: () => any,
  faucet: () => any,
  getPolyFee: () => any
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
  getPolyFee,
}

type Props = {||} & StateProps & DispatchProps

type State = {|
  isConfirmationModalOpen: boolean,
  isNotEnoughPolyModalOpen: boolean,
  polyCost: number,
  fundsReceiver: Address,
  isConfirmationModal2Open: boolean,
|}

class ConfigureSTO extends Component<Props, State> {

  state = {
    isConfirmationModalOpen: false,
    isNotEnoughPolyModalOpen: false,
    polyCost: 0,
    fundsReceiver: '',
    isConfirmationModal2Open: false,
  }

  componentWillMount () {
    this.props.getPolyFee().then((fee) => {
      this.setState({ polyCost: Number(fee) })
    })
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
      this.setState({ isConfirmationModal2Open: true })
    }
  }

  handleConfirm2 = () => {
    this.setState({ isConfirmationModal2Open: false })
    this.props.configure(this.state.polyCost, this.state.fundsReceiver)
  }

  handleConfirmationCancel = () => {
    this.setState({ isConfirmationModalOpen: false })
    this.setState({ isConfirmationModal2Open: false })
  }

  handleNotEnoughPolyCancel = () => {
    this.setState({ isNotEnoughPolyModalOpen: false })
  }

  handleFaucetRequest = () => {
    this.setState({ isNotEnoughPolyModalOpen: false })
    this.props.faucet()
  }

  handleAddressChange = (event: Object, newValue: string) => {
    this.setState({ fundsReceiver: newValue })
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
                      providers before you click on &laquo;CONTINUE&raquo;.
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
                    CANCEL
                  </Button>
                  <Button onClick={this.handleConfirm}>CONTINUE</Button>
                </ModalFooter>
              </ComposedModal>
              <ComposedModal open={this.state.isConfirmationModal2Open} className='pui-confirm-modal'>
                <ModalHeader
                  label='Confirmation required'
                  title={(
                    <span>
                      <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                      Proceeding with Smart Contract Deployment and Scheduling
                    </span>
                  )}
                />
                <ModalBody>
                  <div className='bx--modal-content__text' >
                    <p>
                    Completion of your STO smart contract deployment and scheduling will
                     require two wallet transactions. 
                    </p>

                    <p>
                    The first transaction will be used to pay for the smart contract fee of:
                    </p>
                    <div className='bx--details '>
                      {this.state.polyCost} POLY
                    </div>
                    <p>
                      The second transaction will be used to pay the mining fee (aka gas fee) to complete the
                       scheduling of your STO. Please hit &laquo;CONFIRM&raquo; when you are ready to proceed.
                    </p>

                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button kind='secondary' onClick={this.handleConfirmationCancel}>
                    CANCEL
                  </Button>
                  <Button onClick={this.handleConfirm2}>CONFIRM</Button>
                </ModalFooter>
              </ComposedModal>

              <ComposedModal
                open={this.state.isNotEnoughPolyModalOpen && this.props.networkName !== 'Mainnet'}
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
                    <Remark title='Note'>
                      This option is not available on
                      <span style={{ fontWeight: 'bold' }}>Main Network.</span>
                    </Remark>
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
                open={this.state.isNotEnoughPolyModalOpen && this.props.networkName === 'Mainnet'}
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
                    <ConfigureSTOForm
                      onSubmit={this.handleCompleteSubmit}
                      onAddressChange={this.handleAddressChange}
                    />
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
