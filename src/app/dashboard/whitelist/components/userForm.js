// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import { required, ethereumAddress } from 'polymath-ui/dist/validate'

export const formName = 'user_form'

type Props = {}

class InvestorForm extends Component<Props> {

  render () {
    return (
      <Form>
        <Field
          name='address'
          component={TextInput}
          label='Eth Address'
          placeholder='Investor Address'
          validate={[required, ethereumAddress]}
        />
        <Field
          name='sell'
          component={TextInput}
          label='Sell Restriction Date'
          validate={[required]}
          placeholder='Please type the exact format mm/dd/yyyy'
        />

        <Field
          name='buy'
          component={TextInput}
          label='Buy Restriction Date'
          validate={[required]}
          placeholder='Please type the exact format mm/dd/yyyy'
        />
        <p>&nbsp;</p>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(InvestorForm)
