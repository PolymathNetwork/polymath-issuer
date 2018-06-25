// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Icon, ComposedModal, ModalHeader, ModalBody, ModalFooter, Button } from 'carbon-components-react'
import { etherscanTx, etherscanAddress, Countdown } from 'polymath-ui'
import moment from 'moment'
import type { SecurityToken } from 'polymathjs/types'

import { complete } from './actions'
import NotFoundPage from '../NotFoundPage'
import Progress from './components/Progress'
import CompleteTokenForm from './components/CompleteTokenForm'
import MintTokens from './components/MintTokens'
import type { RootState } from '../../redux/reducer'

import './style.css'

type StateProps = {|
  token: ?SecurityToken,
|}

type DispatchProps = {|
  complete: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
})

const mapDispatchToProps: DispatchProps = {
  complete,
}

type Props = {||} & StateProps & DispatchProps

type State = {|
  isModalOpen: boolean,
|}

class TokenPage extends Component<Props, State> {
  state = {
    isModalOpen: false,
  }

  handleCompleteSubmit = () => {
    this.setState({ isModalOpen: true })
  }

  handleConfirm = () => {
    this.setState({ isModalOpen: false })
    this.props.complete()
  }

  handleCancel = () => {
    this.setState({ isModalOpen: false })
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
          <ComposedModal open={this.state.isModalOpen} className='pui-confirm-modal'>
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
                  Please confirm that all previous information is correct and that you are not violating any trademarks.
                  Once you hit &laquo;CONFIRM&raquo;, your Token will be created on the blockchain and will be
                  immutable. Any change will require that you start the process over. If you wish to review your
                  information, please select &laquo;CANCEL&raquo;.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button kind='secondary' onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button onClick={this.handleConfirm}>Confirm</Button>
            </ModalFooter>
          </ComposedModal>
          <div>
            <div className='bx--row'>
              {!token.address && token.expires ? (
                <div className='bx--col-xs-7'>
                  <div className='pui-page-box'>
                    <div className='token-countdown-container'>
                      <Countdown small title='Time Left' deadline={token.expires} />
                    </div>
                    <h2 className='pui-h2'>Create Your Security Token</h2>
                    <h3 className='pui-h3'>
                      Create your security token before your token reservation expires. If you let your token
                      reservation expire, the token symbol you selected will be available for others to claim.
                    </h3>
                    <h3 className='pui-h3'>
                      To proceed with the creation of your security token, we recommend you work with your Advisory to
                      answer the following questions:
                    </h3>
                    <br />
                    <CompleteTokenForm onSubmit={this.handleCompleteSubmit} />
                  </div>
                </div>
              ) : (
                ''
              )}
              {token.address ? <MintTokens /> : ''}
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
                  ) : ('')}
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>
                      Symbol {!token.address ? 'Reservation' : 'Issuing'} Transaction
                    </label>
                    <p>{etherscanTx(token.txHash)}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='name' className='bx--label'>
                      Symbol {!token.address ? 'Reservation' : 'Issuing'} Date
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

export default connect(mapStateToProps, mapDispatchToProps)(TokenPage)
