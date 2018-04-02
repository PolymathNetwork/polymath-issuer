// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import type { RouterHistory } from 'react-router'
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { change } from 'redux-form'

import SignUpForm, { formName } from './components/SignUpForm'
import { signUp } from './actions'

type StateProps = {|
  account: ?string,
  isSignedUp: boolean,
  token: Object,
|}

type DispatchProps = {|
  change: (?string) => any,
  signUp: () => any,
|}

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  isSignedUp: !!state.token.token,
  token: state.token.token,
})

const mapDispatchToProps: DispatchProps = {
  change: (value) => change(formName, 'owner', value, false, false),
  signUp,
}

type Props = {|
  history: RouterHistory,
|} & StateProps & DispatchProps

class SignUpPage extends Component<Props> {

  componentWillMount () {
    if (this.props.isSignedUp) {
      this.props.history.push('/dashboard')
    }
    this.props.change(this.props.account)
  }

  handleSubmit = () => {
    this.props.signUp()
  }

  render () {
    return (
      <DocumentTitle title='Sign Up – Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-12'>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to='/'>Home</Link>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className='bx--type-mega'>Token Symbol Registration</h1>
            <p>&nbsp;</p>
            <SignUpForm onSubmit={this.handleSubmit} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)
