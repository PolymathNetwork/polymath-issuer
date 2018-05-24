// @flow
/* eslint-disable jsx-no-bind */

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Form } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import { required, ethereumAddress } from 'polymath-ui/dist/validate'

import DatePickerSingleInput from './DatePickerSingleInput'

export const formName = 'add_investor_form'

type Props = {|
|}

class AddInvestorForm extends Component<Props> {
  render () {
    return (
      <Form>
        <Field
          name='address'
          component={TextInput}
          label='Investor&apos;s ETH Address'
          placeholder='Enter Investor&apos;s ETH Address'
          validate={[required, ethereumAddress]}
        />
        <Field
          name='sell'
          component={DatePickerSingleInput}
          label='Sale Lockup End Date'
          validate={[required]}
          placeholder='mm / dd / yyyy'
        />
        <Field
          name='buy'
          component={DatePickerSingleInput}
          label='Purchase Lockup End Date'
          validate={[required]}
          placeholder='mm / dd / yyyy'
        />
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(AddInvestorForm)
