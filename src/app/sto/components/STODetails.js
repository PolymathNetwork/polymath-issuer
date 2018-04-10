// @flow

import React, { Component } from 'react'
import { Tile, Button, Icon } from 'carbon-components-react'
import { etherscanAddress } from 'polymath-ui'
import type { STOFactory } from 'polymathjs/types'

type Props = {|
  item: STOFactory,
  handleUseSTO?: () => Function
|}

export default class STODetails extends Component<Props> {

  render () {
    const { item } = this.props
    return (
      <Tile className='sto-factory'>
        <h3 className='bx--type-beta'>{item.title}</h3>
        <div className='bx--row'>
          <div className='bx--col-xs-2'>
            <h3 className='bx--type-zeta'>Name</h3>
            {item.name}
          </div>
          <div className='bx--col-xs-3'>
            <h3 className='bx--type-zeta'>Used by</h3>
            <ul>
              {item.usedBy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className='bx--col-xs-5'>
            <h3 className='bx--type-zeta'>Description</h3>
            {item.desc}
          </div>
          <div className='bx--col-xs-2'>
            <h3 className='bx--type-zeta'>Verified on Etherscan</h3>
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

            <p>&nbsp;</p>
            <h3 className='bx--type-zeta'>Security Audit by</h3>
            {item.securityAuditBy}
          </div>
        </div>
        <div className='sto-factory-actions'>
          {etherscanAddress(item.address, <Button kind='secondary'>See on Etherscan</Button>)}
          {this.props.handleUseSTO !== undefined ? (
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={this.props.handleUseSTO}>
                USE STO
              </Button>
            </span>
          ) : ''}
        </div>
      </Tile>
    )
  }
}
