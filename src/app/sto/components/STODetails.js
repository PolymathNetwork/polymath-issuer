// @flow

import React, { Component } from 'react'
import { Button, Icon } from 'carbon-components-react'
import { etherscanAddress } from 'polymath-ui'
import type { STOFactory } from 'polymathjs/types'

type Props = {|
  item: STOFactory,
  handleUseSTO?: () => Function
|}

export default class STODetails extends Component<Props> {

  render () {
    const { item, handleUseSTO } = this.props

    const isSelect = handleUseSTO !== undefined
    const authorAddress = (
      <div className='bx--form-item'>
        <label htmlFor='ticker' className='bx--label'>STO {'Author\'s'} ETH address</label>
        <p>0xd4fcfa94c48bd8a20cc9d047b59b79b59c1c324d</p>
      </div>
    )
    const desc = (
      <div className='bx--form-item'>
        <label htmlFor='ticker' className='bx--label'>Description</label>
        <p>{item.desc}</p>
      </div>
    )
    const verifiedByEtherscan = (
      <div className='bx--form-item'>
        <label htmlFor='ticker' className='bx--label'>Verified by Etherscan</label>
        {item.isVerified ? (
          <div>
            <Icon
              name='checkmark--glyph'
              fill='green'
            />
            &nbsp;Yes
          </div>
        ) : (
          <div>
            <Icon
              name='close--glyph'
              fill='red'
            />
            &nbsp;No
          </div>
        )}
      </div>
    )
    const verifiedByPolymath = (
      <div className='bx--form-item'>
        <label htmlFor='ticker' className='bx--label'>Verified by Polymath</label>
        {item.isVerified ? (
          <div>
            <Icon
              name='checkmark--glyph'
              fill='green'
            />
            &nbsp;Yes
          </div>
        ) : (
          <div>
            <Icon
              name='close--glyph'
              fill='red'
            />
            &nbsp;No
          </div>
        )}
      </div>
    )
    const securityAuditBy = (
      <div className='bx--form-item'>
        <label htmlFor='ticker' className='bx--label'>Security Audit by</label>
        <p>{item.securityAuditBy}</p>
      </div>
    )
    const usedBy = (
      <div className='bx--form-item'>
        <label htmlFor='ticker' className='bx--label'>Used by</label>
        <ul>
          {item.usedBy.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )
    return (
      <div className='pui-page-box'>
        <h2 className='pui-h2 pui-h-tags'>
          {item.title}
          <span className='bx--tag bx--tag--custom'>Raise Funds in POLY</span>
          <span className='bx--tag bx--tag--ibm'>Raise Funds in ETH</span>
        </h2>
        <br />
        {isSelect ? (
          <div className='bx--row'>
            <div className='bx--col-xs-6'>
              {authorAddress}
              {desc}
            </div>
            <div className='bx--col-xs-2'>
              {verifiedByPolymath}
              {verifiedByEtherscan}
            </div>
            <div className='bx--col-xs-2'>
              {securityAuditBy}
            </div>
            <div className='bx--col-xs-2'>
              {usedBy}
            </div>
          </div>
        ) : (
          <div className='bx--row'>
            <div className='bx--col-xs-8'>
              {authorAddress}
              {desc}
            </div>
            <div className='bx--col-xs-4'>
              {verifiedByPolymath}
              {verifiedByEtherscan}
              {securityAuditBy}
              {usedBy}
            </div>
          </div>
        )}
        <div style={isSelect ? { textAlign: 'right' } : {}}>
          {etherscanAddress(item.address, <Button kind='secondary'>See on Etherscan</Button>)}
          {isSelect ? (
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={handleUseSTO}>
                USE STO
              </Button>
            </span>
          ) : ''}
        </div>
      </div>
    )
  }
}
