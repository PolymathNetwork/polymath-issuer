// @flow

import BigNumber from 'bignumber.js'
import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { Button } from 'carbon-components-react'
import type { SecurityToken, STOFactory } from 'polymathjs/types'

import NotFoundPage from '../../NotFoundPage'
import STODetails from './STODetails'
import ConfigureSTOForm from './ConfigureSTOForm'
import { configure, goBack } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  account: ?string,
  token: ?SecurityToken,
  factory: ?STOFactory,
  networkName: string,
  polyBalance: BigNumber
|}

type DispatchProps = {|
  configure: () => any,
  goBack: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  factory: state.sto.factory,
  networkName: state.network.name,
  polyBalance: state.pui.account.balance,
})

const mapDispatchToProps: DispatchProps = {
  configure,
  goBack,
}

type Props = {|
|} & StateProps & DispatchProps

class ConfigureSTO extends Component<Props> {

  handleGoBack = () => {
    this.props.goBack()
  }

  handleSubmit = () => {
    this.props.configure()
  }

  render () {
    const { token, factory } = this.props
    if (!token || !token.address || !factory) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`Configure ${token.ticker} STO – Polymath`}>
        <div>
          <div className='bx--row'>
            <div className='bx--col-xs-12'>
              <Button
                kind='ghost'
                onClick={this.handleGoBack}
                className='pui-go-back'
                icon='arrow--left'
              >
                Go back
              </Button>
              <h1 className='pui-h1'>Security Token Offering Configuration</h1>
              <br />
              <div className='bx--row'>
                <div className='bx--col-xs-5'>
                  <div className='pui-page-box'>
                    <h2 className='pui-h2'>
                      Simple Capped Offering
                    </h2>
                    <h4 className='pui-h4' style={{ marginBottom: '15px' }}>
                      Provide the financial details and timing for your offering below.
                    </h4>
                    <ConfigureSTOForm onSubmit={this.handleSubmit} />
                  </div>
                </div>
                <div className='bx--col-xs-7'>
                  <STODetails item={factory} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureSTO)
