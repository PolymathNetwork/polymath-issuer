// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import {
  required,
  maxLength,
  email,
  ethereumAddress,
} from 'polymath-ui/dist/validate'

export const formName = 'signup'

const maxLength100 = maxLength(100)

type Props = {
  handleSubmit: () => void,
}

class SignUpForm extends Component<Props> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field
          name='_account'
          component={TextInput}
          label='Ethereum address'
          disabled
          validate={[required, ethereumAddress]}
        />
        <Field
          name='name'
          component={TextInput}
          label='Name'
          placeholder='Enter your full name'
          validate={[required, maxLength100]}
        />
        <Field
          name='email'
          component={TextInput}
          label='Email'
          placeholder='Enter your contact email address'
          validate={[required, email]}
        />
        <Field
          name='phone'
          component={TextInput}
          label='Phone'
          placeholder='Enter your contact phone number'
          validate={[maxLength100]}
        />
        <p>&nbsp;</p>
        <Button type='submit'>
          Submit
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(SignUpForm)
