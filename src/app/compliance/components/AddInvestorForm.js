// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { Form, Button } from 'carbon-components-react'
import { TextInput, Remark } from 'polymath-ui'
import { required, ethereumAddress } from 'polymath-ui/dist/validate'

import LockupDatesFields, { validate } from './LockupDatesFields'

type StateProps = {|
  isSalePermanent: boolean,
  isPurchasePermanent: boolean,
|}

type Props = {|
  handleSubmit: () => void,
  onClose: () => void,
|} & StateProps

export const formName = 'add_investor_form'

const formValue = formValueSelector(formName)

const mapStateToProps = (state) => ({
  isSalePermanent: !!formValue(state, 'permanentSale'),
  isPurchasePermanent: !!formValue(state, 'permanentPurchase'),
})

class AddInvestorForm extends Component<Props> {

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field
          name='address'
          component={TextInput}
          label='Investor&apos;s ETH Address'
          placeholder='Enter Investor&apos;s ETH Address'
          validate={[required, ethereumAddress]}
        />
        <LockupDatesFields
          isSalePermanent={this.props.isSalePermanent}
          isPurchasePermanent={this.props.isPurchasePermanent}
        />
        <br />
        <Remark title='Reminder'>
          Investors must be approved before they are added to the whitelist.
        </Remark>
        <p align='right'>
          <Button kind='secondary' onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button type='submit'>
            Add New Investor
          </Button>
        </p>
      </Form>
    )
  }
}

export default connect(mapStateToProps)(reduxForm({
  form: formName,
  validate,
})(AddInvestorForm))
