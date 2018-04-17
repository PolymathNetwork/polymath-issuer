// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Icon } from 'carbon-components-react'
import { etherscanAddress } from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'

import { complete } from './actions'
import NotFoundPage from '../NotFoundPage'
import CompleteTokenForm from './components/CompleteTokenForm'
import type { RootState } from '../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  isMainnet: boolean,
|}

type DispatchProps = {|
  complete: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isMainnet: state.network.id === 1,
})

const mapDispatchToProps: DispatchProps = {
  complete,
}

type Props = {|
|} & StateProps & DispatchProps

class TokenPage extends Component<Props> {

  handleCompleteSubmit = () => {
    this.props.complete()
  }

  complete (token: SecurityToken) {
    return (
      <div>
        <h2 className='pui-h2'><Icon name='warning--glyph' fill='#efc100' width='27' height='24' /> Complete {token.ticker} Token Registration</h2>
        <h3 className='pui-h3'>Complete your security token registration before it expires. If your registration expires the token symbol you selected will be made available for others to claim.</h3>
        <br /><br />
        <h2 className='pui-h2'>Security Token Issuance</h2>
        <h3 className='pui-h3'>
          You are one step closer to issuing your Security Token.
          Please ensure you have the necessary documentation and information before you proceed.
        </h3>
        <CompleteTokenForm onSubmit={this.handleCompleteSubmit} />
      </div>
    )
  }

  render () {
    const token = this.props.token
    if (!token) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={token.ticker + ' Token – Polymath'}>
        <div>
          <div className='bx--row'>
            {!token.address ? (
              <div className='bx--col-xs-7'>
                <div className='pui-page-box'>
                  {this.complete(token)}
                </div>
              </div>
            ) : ''}
            <div className='bx--col-xs-5'>
              <div className='pui-page-box'>
                <div className='bx--form-item'>
                  <label htmlFor='ticker' className='bx--label'>Token Symbol</label>
                  <p>{token.ticker}</p>
                </div>
                <div className='bx--form-item'>
                  <label htmlFor='owner' className='bx--label'>Owner</label>
                  <p>{etherscanAddress(token.owner)}</p>
                </div>
                <div className='bx--form-item'>
                  <label htmlFor='name' className='bx--label'>Name</label>
                  <p>{token.name}</p>
                </div>
                <div className='bx--form-item'>
                  <label htmlFor='company' className='bx--label'>Company</label>
                  <p>{token.company}</p>
                </div>
                <div className='bx--form-item'>
                  <label htmlFor='desc' className='bx--label'>Description</label>
                  <p>{token.desc}</p>
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
