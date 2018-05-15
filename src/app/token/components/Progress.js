// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ProgressIndicator, ProgressStep } from 'carbon-components-react'
import type { SecurityToken } from 'polymathjs/types'

import { isProvidersPassed } from '../../providers/data'
import type { RootState } from '../../../redux/reducer'
import type { ServiceProvider } from '../../providers/data'

type StateProps = {|
  token: ?SecurityToken,
  sto: ?Object,
  providers: ?Array<ServiceProvider>,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  providers: state.providers.data,
  token: state.token.token,
  sto: state.sto.contract,
})

type Props = {|
|} & StateProps

class Progress extends Component<Props> {

  render () {
    const { token, sto, providers } = this.props

    let index = 0
    if (sto) {
      index = 4
    } else if (token && token.contract) {
      index = 3
    } else if (isProvidersPassed(providers)) {
      index = 2
    } else if (token) {
      index = 1
    }
    return (
      <div className='bx--row'>
        <div className='bx--col-xs-12'>
          <ProgressIndicator currentIndex={index}>
            <ProgressStep label='Register Token Symbol' />
            <ProgressStep label='Choose Your Providers' />
            <ProgressStep label='Create Token' />
            <ProgressStep label='Set Up Offering Details' />
            <ProgressStep label='Whitelist Investors' />
          </ProgressIndicator>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Progress)
