// @flow

import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, Search } from 'carbon-components-react'
import type { SecurityToken, STOFactory } from 'polymathjs/types'

import NotFoundPage from '../../NotFoundPage'
import STODetails from './STODetails'
import { fetchFactories, useFactory } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  factories: Array<STOFactory>,
|}

type DispatchProps = {|
  fetchFactories: () => any,
  useFactory: (factory: STOFactory) => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  factories: state.sto.factories,
})

const mapDispatchToProps: DispatchProps = {
  fetchFactories,
  useFactory,
}

type Props = {|
|} & StateProps & DispatchProps

class SelectSTO extends Component<Props> {

  componentWillMount () {
    this.props.fetchFactories()
  }

  handleUseSTO = (sto: STOFactory) => {
    return () => this.props.useFactory(sto)
  }

  search () {
    // TODO
  }

  render () {
    const token = this.props.token
    if (!token || !token.address) {
      return <NotFoundPage /> // TODO @bshevchenko: show tip and link to complete token form instead of 404
    }
    return (
      <DocumentTitle title={'Select ' + token.ticker + ' STO – Polymath'}>
        <div>
          <div className='bx--row'>
            <div className='bx--col-xs-12'>
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to='/'>Home</Link>
                </BreadcrumbItem>
              </Breadcrumb>
              <h3 className='bx--type-mega'>Security Token Offerings</h3><br /><br />
              <Search small labelText='Search' placeHolderText='Search' /><br /><br />
              {this.props.factories.map((item) => (
                <STODetails key={item.address} item={item} handleUseSTO={this.handleUseSTO(item)} />
              ))}
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSTO)
