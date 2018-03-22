// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { change } from 'redux-form'

import SignUpForm, { formName } from './components/SignUpForm'
import { signUp } from './actions'

type Props = {
  account: string,
  change: (newAccount: string) => void,
  signUp: () => void,
}

class SignUpPage extends Component<Props> {
  componentWillMount () {
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

const mapStateToProps = (state) => ({
  account: state.network.account,
})

const mapDispatchToProps = {
  change: (value) => change(formName, 'owner', value, false, false),
  signUp,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)
