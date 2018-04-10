// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { change } from 'redux-form'
import type { RouterHistory } from 'react-router'

import TickerForm, { formName } from './components/TickerForm'
import { register } from './actions'

type StateProps = {|
  account: ?string,
  isSignedUp: boolean,
  token: Object,
|}

type DispatchProps = {|
  change: (?string) => any,
  register: () => any,
|}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  isSignedUp: !!state.token.token,
  token: state.token.token,
})

const mapDispatchToProps: DispatchProps = {
  change: (value) => change(formName, 'owner', value, false, false),
  register,
}

type Props = {|
  history: RouterHistory,
|} & StateProps & DispatchProps

class TickerPage extends Component<Props> {

  componentWillMount () {
    this.props.change(this.props.account)
  }

  handleSubmit = () => {
    this.props.register()
  }

  render () {
    return (
      <DocumentTitle title='Token Symbol Registration – Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-12'>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to='/'>Home</Link>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className='bx--type-mega'>Token Symbol Registration</h1>
            <p>&nbsp;</p>
            <TickerForm onSubmit={this.handleSubmit} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerPage)
