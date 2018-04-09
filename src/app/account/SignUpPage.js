// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { change } from 'redux-form'
import type { RouterHistory } from 'react-router'

import SignUpForm, { formName } from './components/SignUpForm'
import { signUp } from './actions'
import type { RootState } from '../../redux/reducer'

type StateProps = {|
  account: ?string,
  isSignedUp: ?boolean,
|}

type DispatchProps = {|
  change: (?string) => any,
  signUp: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  account: state.network.account,
  isSignedUp: state.account.isSignedUp,
})

const mapDispatchToProps: DispatchProps = {
  change: (value) => change(formName, '_account', value, false, false),
  signUp,
}

type Props = {|
  history: RouterHistory,
|} & StateProps & DispatchProps

class SignUpPage extends Component<Props> {

  componentWillMount () {
    if (this.props.isSignedUp) {
      this.props.history.push('/ticker')
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
            <h1 className='bx--type-mega'>Sign Up</h1>
            <p>&nbsp;</p>
            <SignUpForm onSubmit={this.handleSubmit} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)
