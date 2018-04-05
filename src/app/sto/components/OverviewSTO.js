// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import type { STOPurchase } from 'polymath.js_v2'
import { STOStatus } from 'polymath-ui'

import { fetchPurchases } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  purchases: Array<STOPurchase>
|}

type DispatchProps = {|
  fetchPurchases: () => any
|}

const mapStateToProps = (state: RootState): StateProps => ({
  purchases: state.sto.purchases,
})

const mapDispatchToProps: DispatchProps = {
  fetchPurchases,
}

type Props = {|
|} & StateProps & DispatchProps

class ConfigureSTO extends Component<Props> {

  componentWillMount () {
    this.props.fetchPurchases()
  }

  render () {
    return (
      <Fragment>
        <h1 className='bx--type-alpha'>
          Security Token Overview
        </h1>
        <STOStatus />
        <h3 className='bx--type-beta'>
          List of Investors
        </h3>
      </Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureSTO)
