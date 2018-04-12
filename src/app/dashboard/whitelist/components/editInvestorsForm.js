// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import { required } from 'polymath-ui/dist/validate'

export const formName = 'edit_investor_form'

type Props = {}

class EditInvestorsForm extends Component<Props> {

  render () {
    return (
      <Form>
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
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(EditInvestorsForm)
