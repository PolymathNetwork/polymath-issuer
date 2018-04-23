// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { bull } from 'polymath-ui'

import SignUpForm from './components/SignUpForm'
import { signUp } from './actions'

type DispatchProps = {|
  signUp: () => any,
|}

const mapDispatchToProps: DispatchProps = {
  signUp,
}

class SignUpPage extends Component<DispatchProps> {

  handleSubmit = () => {
    this.props.signUp()
  }

  render () {
    return (
      <DocumentTitle title='Sign Up – Polymath'>
        <div className='pui-single-box'>
          <div className='pui-single-box-header'>
            <div className='pui-single-box-header-text'>
              <h1 className='pui-h1'>Sign up</h1>
              <h3 className='pui-h3'>Create your account by entering your name<br /> and email below.</h3>
            </div>
            <div className='pui-single-box-bull'>
              <img src={bull} alt='Bull' />
            </div>
            <div className='pui-clearfix' />
          </div>
          <SignUpForm onSubmit={this.handleSubmit} />
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(null, mapDispatchToProps)(SignUpPage)
