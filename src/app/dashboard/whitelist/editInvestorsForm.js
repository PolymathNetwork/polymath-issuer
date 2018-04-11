// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import { required, ethereumAddress } from 'polymath-ui/dist/validate'

export const formName = 'edit_investor_form'

type Props = {
  handleSubmit: () => void,
}

class EditInvestorsForm extends Component<Props> {

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
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
})(EditInvestorsForm)
