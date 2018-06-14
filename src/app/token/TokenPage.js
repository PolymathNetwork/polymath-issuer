// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { etherscanTx, TxSuccess, Countdown } from 'polymath-ui'
import moment from 'moment'
import type { SecurityToken } from 'polymathjs/types'

import { complete } from './actions'
import NotFoundPage from '../NotFoundPage'
import Progress from './components/Progress'
import CompleteTokenForm from './components/CompleteTokenForm'
import type { RootState } from '../../redux/reducer'

import './style.css'

type StateProps = {|
  token: ?SecurityToken,
    isDeploySuccess: boolean,
|}

type DispatchProps = {|
  complete: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isDeploySuccess: state.pui.tx.success !== null,
})

const mapDispatchToProps: DispatchProps = {
  complete,
}

type Props = {||} & StateProps & DispatchProps

class TokenPage extends Component<Props> {
  handleCompleteSubmit = () => {
    this.props.complete()
  }

  render () {
    const { token, isDeploySuccess } = this.props
    if (!token) {
      return <NotFoundPage />
    }
    // $FlowFixMe
    const txSuccess = <TxSuccess className='pui-single-box-internal' />
    return (
      <DocumentTitle title={`${token.ticker} Token – Polymath`}>
        <div>
          <Progress />

          <div>
            {isDeploySuccess ? (
              txSuccess
            ) : (
              <div className='bx--row'>
                {!token.address && token.expires ? (
                  <div className='bx--col-xs-7'>
                    <div className='pui-page-box'>
                      <div className='token-countdown-container'>
                        <Countdown small title='Time Left' deadline={token.expires} />
                      </div>
                      <h2 className='pui-h2'>Create Your Security Token</h2>
                      <h3 className='pui-h3'>
                          Create your security token before your token registration expires. If you let your token
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
                ) : ''}
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
                    <div className='bx--form-item'>
                      <label htmlFor='owner' className='bx--label'>
                          Symbol Registration Transaction
                      </label>
                      <p>{etherscanTx(token.txHash, token.txHash)}</p>
                    </div>
                    <div className='bx--form-item'>
                      <label htmlFor='name' className='bx--label'>
                          Symbol Registration Date
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
            )}
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenPage)
