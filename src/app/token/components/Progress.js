// @flow

import React, { Component } from 'react'
import { ProgressIndicator, ProgressStep } from 'carbon-components-react'

type Props = {
  current: number,
}

export default class Progress extends Component<Props> {
  render () {
    return (
      <div className='bx--row'>
        <div className='bx--col-xs-12'>
          <ProgressIndicator currentIndex={this.props.current}>
            <ProgressStep label='Register Token Symbol' />
            <ProgressStep label='Launch Token' />
            <ProgressStep label='Choose Your Providers' />
            <ProgressStep label='Set up Your STO Details' />
            <ProgressStep label='Whitelist Your Investors' />
          </ProgressIndicator>
        </div>
      </div>
    )
  }
}
