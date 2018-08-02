// @flow

import React, { Component } from 'react'
import type { Node } from 'react'

type Props = {|
  children: Node,
|}

export default class Email extends Component<Props> {
  render () {
    return (
      <div className='wrapper'>
        <div className='top-bar'>
          <img alt='Icon' src='https://polymath-offchain.herokuapp.com/img/logo.png' />
        </div>
        <div className='content'>
          {this.props.children}
          <div className='icon-text' style={{ height: '52px' }}>
            <div className='icon question'>
              <img alt='Icon' src='https://polymath-offchain.herokuapp.com/img/question.png' />
            </div>
            <h2>
              If you have any questions, please reach out to<br />
              <a href='mailto:tokenstudio@polymath.zendesk.com'>tokenstudio@polymath.zendesk.com</a>
            </h2>
          </div>
          <h2 className='sincere'>
            Best,<br />
            Polymath Support
          </h2>
        </div>
        <div className='footer'>
          <div className='left'>
            © 2018 Polymath
          </div>
          <div className='right'>
            <a href='https://polymath.network/termsofservice.html'>Terms of service</a>
            <a href='https://polymath.network/privacypolicy.html'>Privacy policy</a>
          </div>
        </div>
      </div>
    )
  }
}
