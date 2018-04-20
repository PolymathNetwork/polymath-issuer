// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { bull } from 'polymath-ui'
import type { RouterHistory } from 'react-router'

import SignUpForm from './components/SignUpForm'
import { signUp } from './actions'
import type { RootState } from '../../redux/reducer'

type StateProps = {|
  isSignedUp: ?boolean,
|}

type DispatchProps = {|
  signUp: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  isSignedUp: state.account.isSignedUp,
})

const mapDispatchToProps: DispatchProps = {
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
  }

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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)
