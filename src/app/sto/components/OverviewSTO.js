// @flow

import React, { Component, Fragment } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { STOStatus } from 'polymath-ui'
import type { SecurityToken, STOPurchase, STODetails } from 'polymathjs'

import NotFoundPage from '../../NotFoundPage'
import InvestorTable from './InvestorTable'
import { fetchPurchases } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  details: ?STODetails,
  purchases: Array<STOPurchase>
|}

type DispatchProps = {|
  fetchPurchases: () => any
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  details: state.sto.details,
  purchases: state.sto.purchases,
})

const mapDispatchToProps: DispatchProps = {
  fetchPurchases,
}

type Props = {|
|} & StateProps & DispatchProps

class OverviewSTO extends Component<Props> {

  componentWillMount () {
    this.props.fetchPurchases()
  }

  render () {
    const { token, details, purchases } = this.props
    if (!token || !details) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={token.ticker + ' STO Overview – Polymath'}>
        <Fragment>
          <h1 className='pui-h1'>{token.ticker} STO Overview</h1><br />
          <STOStatus
            title='Capped STO'
            start={details.start}
            end={details.end}
            raised={details.raised}
            cap={details.cap}
            isPolyFundraise={details.isPolyFundraise}
          />
          <br /><br />
          <h2 className='pui-h2'>
            List of Investors
          </h2>
          <InvestorTable rows={purchases} />
          <p>&nbsp;</p>
        </Fragment>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewSTO)
