// @flow

import React, { Component, Fragment } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { STOStatus } from 'polymath-ui'
import type { SecurityToken, STOPurchase, STODetails } from 'polymathjs'

import NotFoundPage from '../../NotFoundPage'
import InvestorTable from './InvestorTable'
import { fetchPurchases, togglePauseSto  } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  details: ?STODetails,
  purchases: Array<STOPurchase>,
  isStoPaused: boolean,
|}

type DispatchProps = {|
  fetchPurchases: () => any,
  togglePauseSto: (endDate: Date) => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  details: state.sto.details,
  purchases: state.sto.purchases,
  isStoPaused: state.sto.pauseStatus,
})

const mapDispatchToProps: DispatchProps = {
  fetchPurchases,
  togglePauseSto,
}

type Props = {|
|} & StateProps & DispatchProps

class OverviewSTO extends Component<Props> {

  componentWillMount () {
    this.props.fetchPurchases()
  }

  handlePause = () => { // $FlowFixMe
    this.props.togglePauseSto(this.props.details.end)
  }

  render () {
    const { token, details, purchases } = this.props
    if (!token || !details) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`${token.ticker} STO Overview – Polymath`}>
        <div>
          <Fragment>
            <h1 className='pui-h1'>Security Token Overview</h1>
            <br />
            <STOStatus // eslint-disable-next-line react/jsx-handler-names
              toggleStoPause={this.handlePause}
              details={details}
              token={token}
              isStoPaused={this.props.isStoPaused}
            />
            <br />
            <br />
            <h2 className='pui-h2'>List of Investors</h2>
            <div className={this.props.isStoPaused ? 'pui-paused' : ''}>
              <InvestorTable isStoPaused={this.props.isStoPaused} rows={purchases} />
            </div>
            <p>&nbsp;</p>
          </Fragment>
        </div>
      </DocumentTitle>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewSTO)
