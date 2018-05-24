// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Form } from 'carbon-components-react'
import { required } from 'polymath-ui/dist/validate'

import DatePickerSingleInput from './DatePickerSingleInput'

export const formName = 'edit_investor_form'

type Props = {||}

class EditInvestorsForm extends Component<Props> {
  render () {
    return (
      <Form>
        <div className='flexFixDatePicker'>
          <Field
            name='sell'
            component={DatePickerSingleInput}
            label='Sell Restriction Date'
            validate={[required]}
            placeholder='mm / dd / yyyy'
          />
          <Field
            name='buy'
            component={DatePickerSingleInput}
            label='Buy Restriction Date'
            validate={[required]}
            placeholder='mm / dd / yyyy'
          />
        </div>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(EditInvestorsForm)
