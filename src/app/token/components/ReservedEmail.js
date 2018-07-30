/* eslint-disable react/style-prop-object */
// @flow

import React, { Component } from 'react'
import { etherscanTx } from 'polymath-ui'
import type { SymbolDetails } from 'polymathjs/types'

import Email from '../../Email'

type Props = {|
  token: SymbolDetails,
  expiryLimit: number,
|}

export default class ReservedEmail extends Component<Props> {

  render () {
    const { token } = this.props // $FlowFixMe
    const etherscan = etherscanTx(token.txHash)
    const ticker = token.ticker.toUpperCase()
    return (
      <Email>
        <h4>Step 1 of 5</h4>
        <h1>Symbol Reserved</h1>
        <div className='main-value'>
          <h2>Token Symbol Has Been Reserved</h2>
          <p className='value' style={{ fontSize: '36px' }}>{ticker}</p>
        </div>
        <div className='icon-text' style={{ height: '57px' }}>
          <div className='icon' style={{ marginTop: '11px' }}>
            <img alt='Icon' src='https://polymath-offchain.herokuapp.com/img/checkmark.png' />
          </div>
          <h2><strong>{ticker}</strong> symbol has been registered on Polymath</h2>
          <div className='tx'>Transaction details on Etherscan: {etherscan}</div>
        </div>
        <div className='icon-text' style={{ height: '78px' }}>
          <div className='icon' style={{ marginTop: '21px' }}>
            <img alt='Icon' src='https://polymath-offchain.herokuapp.com/img/warning.png' />
          </div>
          <h2>
            You have <strong>{this.props.expiryLimit} days</strong> to proceed with the token issuance<br />
            before the token symbol you registered expires and<br /> becomes available for others to use.
          </h2>
        </div>
      </Email>
    )
  }
}
