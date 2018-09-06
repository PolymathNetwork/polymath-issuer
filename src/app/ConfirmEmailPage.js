// @flow

import { Button, Form } from 'carbon-components-react'
import { bull, TextInput, trim } from 'polymath-ui'
import { required, email } from 'polymath-ui/dist/validate'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { reduxForm, Field } from 'redux-form'

import { confirmEmail } from './ticker/actions'
import type { RootState } from '../redux/reducer'

export const formName = 'confirmEmail'

// TODO @bshevchenko: prob we should extract this file into the polymath-ui with its styles and confirmEmail action

// TODO @bshevchenko: extract into the separate file
class ConfirmEmailFormUnwrapped extends Component<any> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit} className='confirm-email-form'>
        <Field
          name='email'
          component={TextInput}
          placeholder='you@example.com'
          validate={[required, email]}
          normalize={trim}
        />
        <Button type='submit'>
          Send Confirmation Email
        </Button>
      </Form>
    )
  }
}

const ConfirmEmailForm = reduxForm({
  form: formName,
})(ConfirmEmailFormUnwrapped)

type StateProps = {|
  initialEmail: string,
|}

type DispatchProps = {|
  confirmEmail: () => any,
|}

type Props = StateProps & DispatchProps

const mapStateToProps = (state: RootState) => ({
  initialEmail: state.pui.account.email,
})

const mapDispatchToProps = {
  confirmEmail,
}

class ConfirmEmailPage extends Component<Props> {

  handleSubmit = () => {
    this.props.confirmEmail()
  }

  render () {
    return (
      <DocumentTitle title='Confirm Email – Polymath'>
        <div className='pui-single-box'>
          <div className='pui-single-box-header'>
            <div className='pui-single-box-bull'>
              <img src={bull} alt='Bull' />
            </div>
            <h1 className='pui-h1'>Verify Your Email Address</h1>
            <h3 className='pui-h4'>
              Please check that we can contact you at the email address below.
              Once you have confirmed your email address we&apos;ll<br />send you a copy of your transaction details.
            </h3>
            <div className='pui-clearfix' />
            <ConfirmEmailForm
              onSubmit={this.handleSubmit}
              initialValues={{ email: this.props.initialEmail }}
            />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmailPage)
