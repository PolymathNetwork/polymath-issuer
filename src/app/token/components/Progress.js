// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ProgressIndicator, ProgressStep } from 'carbon-components-react'
import type { SecurityToken } from 'polymathjs/types'

import { complete } from '../actions'
import type { RootState } from '../../../redux/reducer'
import type { ServiceProvider } from '../../providers/data'

type StateProps = {|
  token: ?SecurityToken,
  sto: ?Object,
  providers: ?Array<ServiceProvider>,
|}

type DispatchProps = {|
  complete: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  providers: state.providers.data,
  token: state.token.token,
  sto: state.sto.contract,
})

const mapDispatchToProps: DispatchProps = {
  complete,
}

type Props = {|
|} & StateProps & DispatchProps

class Progress extends Component<Props> {

  render () {
    const { token, sto, providers } = this.props

    let isProvidersPassed = true
    if (providers) {
      for (let p: ServiceProvider of providers) {
        if (p.cat === 0) { // only cat 0 is obligatory
          if (p.progress && p.progress.isApplied) {
            isProvidersPassed = true
            break
          }
          if (!p.progress) {
            isProvidersPassed = false
          }
        }
      }
    } else {
      isProvidersPassed = false
    }

    let index = 0
    if (sto) {
      index = 4
    } else if (token && token.contract) {
      index = 3
    } else if (isProvidersPassed) {
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
            <ProgressStep label='Setup Offering Details' />
            <ProgressStep label='Whitelist Investors' />
          </ProgressIndicator>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Progress)
