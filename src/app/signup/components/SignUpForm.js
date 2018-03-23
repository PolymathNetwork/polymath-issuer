// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import {
  required,
  maxLength,
  alphanumeric,
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
          name='ticker'
          component={TextInput}
          label='Enter token symbol'
          placeholder='POLY'
        />
        <Field
          name='contactName'
          component={TextInput}
          label='Contact name'
          placeholder='Trevor Koverko'
          validate={[required, maxLength100]}
        />
        <Field
          name='owner'
          component={TextInput}
          label='Ethereum address'
          disabled
          validate={[required, ethereumAddress]}
        />
        <Field
          name='contactEmail'
          component={TextInput}
          label='Contact email'
          validate={[required, email]}
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
  asyncValidate: async (values) => {
    // async validation doesn't work properly with field-level validation, so we need to describe sync rules here
    const v = values.ticker
    const syncError = required(v) || maxLength(4)(v) || alphanumeric(v)
    if (syncError) {
      // eslint-disable-next-line
      throw {ticker: syncError}
    }
    // noinspection ConstantIfStatementJS
    if (false) { // TODO @bshevchenko: await SecurityTokenRegistrar.isTickerExists(v)
      // eslint-disable-next-line
      throw {ticker: 'Specified ticker is already exists.'}
    }
  },
  asyncBlurFields: ['ticker'],
})(SignUpForm)
