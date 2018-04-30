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
        <label htmlFor='ticker' className='bx--label'>STO Author&apos;s ETH address</label>
        <p>{item.owner}</p>
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
        <label htmlFor='ticker' className='bx--label'>Verified on Etherscan</label>
        {item.isVerified ? (
          <p>
            <Icon
              name='checkmark--glyph'
              fill='#00AA5E'
            />
            &nbsp;Yes
          </p>
        ) : (
          <p>
            <Icon
              name='close--glyph'
              fill='red'
            />
            &nbsp;No
          </p>
        )}
      </div>
    )
    const securityAuditLink = (
      <div className='bx--form-item'>
        <label htmlFor='ticker' className='bx--label'>Contract Audit</label>
        <p>
          <a href={item.securityAuditLink.url} target='_blank'>Link to Security Audit</a>
        </p>
      </div>
    )
    return (
      <div className='pui-page-box sto-factory'>
        <h2 className='pui-h2 pui-h-tags'>
          {item.title}
          <span className='bx--tag bx--tag--custom'>Raise Funds in POLY</span>
          <span className='bx--tag bx--tag--ibm'>Raise Funds in ETH</span>
        </h2>
        <br /><br />
        {isSelect ? (
          <div className='bx--row'>
            <div className='bx--col-xs-8'>
              {authorAddress}
              {desc}
            </div>
            <div className='bx--col-xs-2'>
              {verifiedByEtherscan}
            </div>
            <div className='bx--col-xs-2'>
              {securityAuditLink}
            </div>
          </div>
        ) : (
          <div className='bx--row'>
            <div className='bx--col-xs-9'>
              {authorAddress}
              {desc}
            </div>
            <div className='bx--col-xs-3'>
              {verifiedByEtherscan}
              {securityAuditLink}
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
