// @flow

import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, Tile } from 'carbon-components-react'
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
        <div>
          <div className='bx--row'>
            <div className='bx--col-xs-12'>
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to='/'>Home</Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link to='/dashboard/sto'>STO</Link>
                </BreadcrumbItem>
              </Breadcrumb>
              <h3 className='bx--type-mega'>Security Token Offering Configuration</h3><br /><br />
              <div className='bx--row'>
                <div className='bx--col-xs-5'>
                  <Tile>
                    <ConfigureSTOForm onSubmit={this.handleSubmit}  />
                  </Tile>
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
