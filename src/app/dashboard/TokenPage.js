// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import type { Match } from 'react-router'
import { Breadcrumb, BreadcrumbItem, InlineNotification } from 'carbon-components-react'
import { SecurityTokenRegistry } from 'polymath.js_v2'
import type { SecurityToken } from 'polymath.js_v2/types'

import { completeToken, fetchTokenDetails } from './actions'
import NotFoundPage from '../NotFoundPage'
import { etherscanAddress, etherscanToken } from '../helpers'
import type { RootState } from '../../redux/state.types'
import CompleteTokenForm from './components/CompleteTokenForm'

import './style.css'

type StateProps = {|
  token: ?SecurityToken,
  isMainnet: boolean,
|}

type DispatchProps = {|
  fetchTokenDetails: (ticker: string) => any, // TODO Unused?
  completeToken: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.dashboard.token,
  isMainnet: state.network.id === 1,
})

const mapDispatchToProps: DispatchProps = {
  fetchTokenDetails,
  completeToken,
}

type Props = {|
  match: Match
|} & StateProps & DispatchProps

class TokenPage extends Component<Props> {
  handleCompleteSubmit = () => {
    this.props.completeToken()
  }

  completeToken (token: SecurityToken) {
    const completeFee = SecurityTokenRegistry.fee.toNumber()
    return (
      <div>
        <InlineNotification
          title={'Complete ' + token.ticker + ' Token Registration'}
          subtitle='Complete your security token registration before it expires. If your registration expires the token symbol you selected will be made available for others to claim.'
          kind='warning'
          hideCloseButton
        />
        <h3 className='bx--type-beta'>Security Token Issuance</h3><br />
        <p>
          You are one step away from issuing the security token for your company.
          Please complete your token details to finish the process.
          Issuing a Security Token requires a payment of <strong>{completeFee} POLY</strong> tokens. *
        </p>
        <br />
        <CompleteTokenForm onSubmit={this.handleCompleteSubmit} />
        <br /><br />
        <p className='bx--type-caption'>
          * If you don’t own any POLY tokens,{' '}
          {this.props.isMainnet ?
            <span>please{' '} <a href='https://polymath.network'>get in touch with us</a></span> :
            <span> they will be automatically requested from the Polymath testnet faucet</span>
          }
          .
        </p>
      </div>
    )
  }

  render () {
    if (!this.props.token) {
      return <NotFoundPage />
    }
    const token = this.props.token
    return (
      <DocumentTitle title={token.ticker + ' Token – Polymath'}>
        <div>
          <div className='bx--row'>
            <div className='bx--col-xs-12'>
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to='/'>Home</Link>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
          <div className='bx--row'>
            <div className='bx--col-xs-5'>
              <h1 className='bx--type-mega'>{token.ticker} Token</h1>
              <div className='bx--form-item'>
                <label htmlFor='owner' className='bx--label'>Owner</label>
                <p>{etherscanAddress(token.owner)}</p>
              </div>
              <div className='bx--form-item'>
                <label htmlFor='owner' className='bx--label'>Contact email</label>
                <p><a href={'mailto://' + token.contact}>{token.contact}</a></p>
              </div>
            </div>
            <div className='bx--col-xs-7'>
              {token.address ? (
                <div className='completed-token-details'>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Address</label>
                    <p>{etherscanToken(token.address)}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Name</label>
                    <p>{token.name}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Decimals</label>
                    <p>{token.decimals}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Website</label>
                    <p><a href={token.url} target='_blank'>{token.url}</a></p>
                  </div>
                </div>
              ) : this.completeToken(token)}
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenPage)
