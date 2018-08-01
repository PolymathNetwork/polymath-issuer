// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'
import moment from 'moment'
import { etherscanTx, etherscanAddress, thousandsDelimiter } from 'polymath-ui'
import type { Address } from 'polymathjs/types'

import Email from '../../Email'

type Props = {|
  ticker: string,
  start: Date,
  cap: BigNumber,
  rate: number,
  isPolyFundraise: boolean,
  fundsReceiver: Address,
  txHash: string,
|}

export default class ConfiguredEmail extends Component<Props> {

  render () {
    const { ticker, start, cap, rate, isPolyFundraise } = this.props // $FlowFixMe
    const etherscan = etherscanTx(this.props.txHash)
    const capRate = cap / rate
    const amountOfFunds = isNaN(capRate) || capRate === Infinity ? '0' : thousandsDelimiter(capRate)
    return (
      <Email>
        <h4>Congratulations!</h4>
        <h1>You Have Successfully Created and Scheduled the Security Token Offering for {ticker.toUpperCase()}</h1>
        <div className='icon-text tx-hash'>
          <div className='icon'>
            <img alt='Icon' src='https://polymath-offchain.herokuapp.com/img/checkmark.png' />
          </div>
          <h2>You can view the transaction details here:</h2>
          <div className='tx'>Transaction details on Etherscan: {etherscan}</div>
        </div>
        <div className='text'>
          <h3>Additional details of your Security Token Offering are below:</h3>
          <div className='value'>
            <strong>Scheduled start</strong>
            <p>{moment(start).format('MM/DD/YYYY')}</p>
          </div>
          <div className='value'>
            <strong>ETH Address to receive the funds raised during the STO</strong>
            <p>{etherscanAddress(this.props.fundsReceiver)}</p>
          </div>
          <div className='value'>
            <strong>Rate</strong>
            <p>{thousandsDelimiter(rate)} {ticker.toUpperCase()}/1 {isPolyFundraise ? 'POLY' : 'ETH'}</p>
          </div>
          <div className='value'>
            <strong>Hardcap (in Tokens)</strong>
            <p>{thousandsDelimiter(cap)}</p>
          </div>
          <div className='value'>
            <strong>Amount of Funds the STO Will Raise</strong>
            <p>{amountOfFunds} {isPolyFundraise ? 'POLY' : 'ETH'}</p>
          </div>
          <p align='center'>
            <a href={window.location.origin + '/dashboard/' + ticker + '/sto'}>
              <strong>Click here to access your Security Offering Dashboard</strong>
            </a>
          </p>
        </div>
      </Email>
    )
  }
}
