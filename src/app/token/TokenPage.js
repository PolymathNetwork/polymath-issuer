// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Icon, ComposedModal, ModalHeader, ModalBody, ModalFooter, Button } from 'carbon-components-react'
import { etherscanTx, etherscanAddress, Countdown, Remark } from 'polymath-ui'
import moment from 'moment'
import type { SecurityToken } from 'polymathjs/types'
import BigNumber from 'bignumber.js'

import { issue, faucet, getPolyFee } from './actions'
import NotFoundPage from '../NotFoundPage'
import Progress from './components/Progress'
import CompleteTokenForm from './components/CompleteTokenForm'
import MintTokens from './components/MintTokens'
import type { RootState } from '../../redux/reducer'

import './style.css'

type StateProps = {|
  account: ?string,
  token: ?SecurityToken,
  networkName: string,
  polyBalance: BigNumber,
  stage: number,
|}

type DispatchProps = {|
  complete: (number) => any,
  faucet: (?string, number) => any,
  getPolyFee: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  networkName: state.network.name,
  polyBalance: state.pui.account.balance,
  stage: state.sto.stage,
})

const mapDispatchToProps: DispatchProps = {
  complete: issue,
  faucet,
  getPolyFee,
}

type Props = {||} & StateProps & DispatchProps

type State = {|
  isConfirmationModalOpen: boolean,
  isNotEnoughPolyModalOpen: boolean,
  polyCost: number,
  isConfirmationModal2Open: boolean,
|}

class TokenPage extends Component<Props, State> {
  state = {
    isConfirmationModalOpen: false,
    isNotEnoughPolyModalOpen: false,
    polyCost: 0,
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
    this.props.complete(this.state.polyCost)
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
    this.props.faucet(this.props.account, 25000)
  }

  getNewTokenSection = () => {
    const { token } = this.props
    return !token.address && token.expires ? (
      <div className='bx--col-xs-7'>
        <div className='pui-page-box'>
          <div className='token-countdown-container'>
            <Countdown small title='Time Left' deadline={token.expires} />
          </div>
          <h2 className='pui-h2'>Create Your Security Token</h2>
          <h3 className='pui-h3'>
            Create your security token before your token reservation expires. If you let your token reservation expire,
            the token symbol you selected will be available for others to claim.
          </h3>
          <h3 className='pui-h3'>
            To proceed with the creation of your security token, we recommend you work with your Advisory to answer the
            following questions:
          </h3>
          <br />
          <CompleteTokenForm onSubmit={this.handleCompleteSubmit} />
        </div>
      </div>
    ) : (
      ''
    )
  }

  render () {
    const { token } = this.props
    if (!token) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`${token.ticker} Token – Polymath`}>
        <div>
          <Progress />
          <ComposedModal open={this.state.isConfirmationModalOpen} className='pui-confirm-modal'>
            <ModalHeader
              label='Confirmation required'
              title={
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp; Before You Proceed with the
                  Token Creation
                </span>
              }
            />
            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  Please confirm that you accept the token creation fee. Additionally, please confirm that all previous
                  information is correct and that you are not violating any trademarks. Once you hit
                  &laquo;CONFIRM&raquo;, your newly created token will be sent to the blockchain and will be immutable.
                  If you do not wish to pay the token creation fee or wish to review your information, simply select
                  &laquo;CANCEL&raquo;.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button kind='secondary' onClick={this.handleConfirmationCancel}>
                CANCEL
              </Button>
              <Button onClick={this.handleConfirm}>CONFIRM</Button>
            </ModalFooter>
          </ComposedModal>

          <ComposedModal open={this.state.isConfirmationModal2Open} className='pui-confirm-modal'>
            <ModalHeader
              label='Confirmation required'
              title={
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp; Proceeding with your{' '}
                  {token.ticker.toUpperCase()} Token Creation
                </span>
              }
            />
            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>Completion of your token creation will require two wallet transactions.</p>

                <p>The first transaction will be used to pay for the token creation cost of:</p>
                <div className='bx--details '>{this.state.polyCost} POLY</div>
                <p>
                  The second transaction will be used to pay the mining fee (aka gas fee) to complete the creation of
                  your token. Please hit &laquo;CONFIRM&raquo; when you are ready to proceed.
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
              title={
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp; Insufficient POLY Balance
                </span>
              }
            />

            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  The creation of a security token has a fixed cost of {this.state.polyCost} POLY. Please make sure that
                  your wallet has a sufficient balance in POLY to complete this operation.
                </p>

                <p>
                  You are currently connected to the <span style={{ fontWeight: 'bold' }}>Kovan Test Network</span>.
                </p>

                <p>
                  As such, you can click on the &laquo;REQUEST 25K POLY&raquo; button below to receive 25,000 test POLY
                  in your wallet.
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
              title={
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp; Insufficient POLY Balance
                </span>
              }
            />

            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  The registration of a token symbol has a fixed cost of {this.state.polyCost} POLY. Please make sure
                  that your wallet has a sufficient balance in POLY to complete this operation.
                </p>
                <p>
                  If you need to obtain POLY tokens, you can visit&nbsp;
                  <a target='_blank' rel='noopener noreferrer' href='https://shapeshift.io'>
                    here
                  </a>{' '}
                  or obtain more information&nbsp;
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://etherscan.io/token/0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec#tokenExchange'
                  >
                    here
                  </a>
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleNotEnoughPolyCancel}>Close</Button>
            </ModalFooter>
          </ComposedModal>
          <div>
            <div className='bx--row'>
              {this.getNewTokenSection()}
              {token.address && this.props.stage < 3 ? <MintTokens /> : ''}
              <div className='bx--col-xs-5'>
                <div className='pui-page-box'>
                  <div className='ticker-field'>
                    <div className='bx--form-item'>
                      <label htmlFor='ticker' className='bx--label'>
                        Token Symbol
                      </label>
                      <input
                        type='text'
                        name='ticker'
                        value={token.ticker}
                        id='ticker'
                        readOnly
                        className='bx--text-input bx--text__input'
                      />
                    </div>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='name' className='bx--label'>
                      Token Name
                    </label>
                    <p>{token.name}</p>
                  </div>
                  {token.address ? (
                    <div className='bx--form-item'>
                      <label htmlFor='name' className='bx--label'>
                        Token Address
                      </label>
                      <p>{etherscanAddress(token.address)}</p>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>
                      {!token.address ? 'Symbol' : 'Token '} Issuance Transaction
                    </label>
                    <p>{etherscanTx(token.txHash)}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='name' className='bx--label'>
                      {!token.address ? 'Symbol' : 'Token '} Issuance Date
                    </label>
                    <p>{moment(token.timestamp).format('D MMMM, YYYY')}</p>
                  </div>
                  <hr />
                  <div className='bx--form-item'>
                    <label htmlFor='name' className='bx--label'>
                      Issuer&apos;s ETH Address
                    </label>
                    <p>{token.owner}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TokenPage)
