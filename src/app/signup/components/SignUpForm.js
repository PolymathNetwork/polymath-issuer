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
import { TickerRegistrar } from 'polymath.js_v2'

export const formName = 'signup'

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
          name='owner'
          component={TextInput}
          label='Ethereum address'
          disabled
          validate={[required, ethereumAddress]}
        />
        <Field
          name='contact'
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
    // async validation doesn't work properly with field-level validation, so we need to specify sync rules here
    const v = values.ticker
    const syncError = required(v) || maxLength(4)(v) || alphanumeric(v)
    if (syncError) {
      // eslint-disable-next-line
      throw { ticker: syncError }
    }
    if (await TickerRegistrar.getDetails(v) !== null) {
      // eslint-disable-next-line
      throw { ticker: 'Specified ticker is already exists.' }
    }
  },
  asyncBlurFields: ['ticker'],
})(SignUpForm)
