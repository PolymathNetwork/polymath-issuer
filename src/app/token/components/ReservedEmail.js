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
        <h4>Congratulations!</h4>
        <h1>You Have Successfully Reserved the Token Symbol {ticker}</h1>
        <div className='icon-text tx-hash'>
          <div className='icon'>
            <img alt='Icon' src='https://polymath-offchain.herokuapp.com/img/checkmark.png' />
          </div>
          <h2>You can view the transaction details here:</h2>
          <div className='tx'>Transaction details on Etherscan: {etherscan}</div>
        </div>
        <div className='icon-text' style={{ height: '78px' }}>
          <div className='icon'>
            <img alt='Icon' src='https://polymath-offchain.herokuapp.com/img/warning.png' />
          </div>
          <h2>
            Your reservation is valid for <strong>{this.props.expiryLimit}</strong> days.<br />
            If the reservation period lapses before your security token is created,
            the ticker will become available for others.
          </h2>
        </div>
        <div className='text'>
          <h3>Before you create your token, you will need to decide whether:</h3>
          <ul>
            <li>your token will be divisible or indivisible;</li>
            <li>
              additional information should be embedded into your token,
              such as a legend or link to your investor relations site.
            </li>
          </ul>
          <p>
            If you are unsure of the above, please consult with your advisors or engage an advisory firm through
            the Polymath Token Studio marketplace before your reservation period expires.
          </p>
        </div>
      </Email>
    )
  }
}
