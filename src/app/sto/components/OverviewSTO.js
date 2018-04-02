// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { STOPurchase } from 'polymath.js_v2'

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
    return <span>Overview</span>
    // TODO
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureSTO)
