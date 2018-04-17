// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { bull } from 'polymath-ui'
import type { RouterHistory } from 'react-router'

import SignUpForm  from './components/SignUpForm'
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
        <div className='bx--row'>
          <div className='bx--col-xs-2' />
          <div className='bx--col-xs-8'>
            <div className='pui-single-box'>
              <div className='bx--row'>
                <div className='bx--col-xs-8'>
                  <h1 className='pui-h1'>Sign up</h1>
                  <h3 className='pui-h3'>Subtitle token reg example and follow the instructions to unlock it.</h3>
                </div>
                <div className='bx--col-xs-4 pui-single-box-bull'>
                  <img src={bull} alt='Bull' />
                </div>
              </div>
              <div className='bx--row'>
                <div className='bx--col-xs-12'>
                  <SignUpForm onSubmit={this.handleSubmit} />
                </div>
              </div>
            </div>
          </div>
          <div className='bx--col-xs-2' />
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)
