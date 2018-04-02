// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetch } from './actions'
import { STAGE_SELECT, STAGE_CONFIGURE, STAGE_OVERVIEW } from './reducer'
import SelectSTO from './components/SelectSTO'
import OverviewSTO from './components/OverviewSTO'
import ConfigureSTO from './components/ConfigureSTO'
import type { RootState } from '../../redux/reducer'

import './style.css'

type StateProps = {|
  stage: number,
|}

type DispatchProps = {|
  fetch: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  stage: state.sto.stage,
})

const mapDispatchToProps: DispatchProps = {
  fetch,
}

type Props = StateProps & DispatchProps

class STOPage extends Component<Props> {

  componentDidMount () {
    this.props.fetch()
  }

  render () {
    switch (this.props.stage) {
      case STAGE_SELECT:
        return <SelectSTO />
      case STAGE_CONFIGURE:
        return <ConfigureSTO />
      case STAGE_OVERVIEW:
        return <OverviewSTO />
      default:
        return <div />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(STOPage)
