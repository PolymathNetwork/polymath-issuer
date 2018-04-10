// @flow

import BigNumber from 'bignumber.js'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import type { STOPurchase } from 'polymath.js_v2'
import { STOStatus } from 'polymath-ui'

import { fetchPurchases } from '../actions'
import InvestorTable from './InvestorTable'
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
        <STOStatus
          title='STO Title'
          startDate={new Date(Date.parse('2018-04-4'))}
          endDate={new Date(Date.parse('2018-04-20'))}
          polyRaised={new BigNumber(10).pow(18).times(50000)}
          polyCap={new BigNumber(10).pow(18).times(100000)}
        />
        <h2 className='bx--type-beta root-header'>
          List of Investors
        </h2>
        <InvestorTable
          rows={[
            {
              id: "a",
              number: 1,
              address: '0x9F5D081c428a9217FE19Df6e3670774ae00A3f1b',
              txHash: '0x62e84aaf05eff567affd2eefe07f31fb747038c6c12570829eb3aef43d33aa9f',
              tokensBought: '2,100 TRV',
              amountInvested: '1 ETH',
            },
            {
              id: "b",
              number: 1,
              address: '0x9F5D081c428a9217FE19Df6e3670774ae00A3f1b',
              txHash: '0x62e84aaf05eff567affd2eefe07f31fb747038c6c12570829eb3aef43d33aa9f',
              tokensBought: '2,100 TRV',
              amountInvested: '1 ETH',
            },
            {
              id: "c",
              number: 3,
              address: '0x9F5D081c428a9217FE19Df6e3670774ae00A3f1b',
              txHash: '0x62e84aaf05eff567affd2eefe07f31fb747038c6c12570829eb3aef43d33aa9f',
              tokensBought: '2,100 TRV',
              amountInvested: '1 ETH',
            },
          ]}
        />
      </Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureSTO)
