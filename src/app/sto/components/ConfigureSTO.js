// @flow

import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import type { SecurityToken, STOFactory } from 'polymathjs/types'

import NotFoundPage from '../../NotFoundPage'
import STODetails from './STODetails'
import ConfigureSTOForm from './ConfigureSTOForm'
import { configure } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  factory: ?STOFactory,
|}

type DispatchProps = {|
  configure: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  factory: state.sto.factory,
})

const mapDispatchToProps: DispatchProps = {
  configure,
}

type Props = {|
|} & StateProps & DispatchProps

class ConfigureSTO extends Component<Props> {

  handleSubmit = () => {
    this.props.configure()
  }

  render () {
    const { token, factory } = this.props
    if (!token || !token.address || !factory) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={'Configure ' + token.ticker + ' STO – Polymath'}>
        <div className='bx--row'>
          <div className='bx--col-xs-12'>
            <h1 className='pui-h1'>Security Token Offering Configuration</h1>
            <br /><br />
            <div className='bx--row'>
              <div className='bx--col-xs-5'>
                <div className='pui-page-box'>
                  <ConfigureSTOForm onSubmit={this.handleSubmit}  />
                </div>
              </div>
              <div className='bx--col-xs-7'>
                <STODetails item={factory} />
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureSTO)
