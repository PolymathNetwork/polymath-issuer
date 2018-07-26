// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { Form, Button } from 'carbon-components-react'
import { TextInput, CheckboxInput, Remark } from 'polymath-ui'
import { required, ethereumAddress } from 'polymath-ui/dist/validate'

import LockupDatesFields, { validate } from './LockupDatesFields'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  isSalePermanent: boolean,
  isPurchasePermanent: boolean,
  isPercentagePaused: boolean,
|}

type Props = {|
  handleSubmit: () => void,
  onClose: () => void,
|} & StateProps

export const formName = 'add_investor_form'

const formValue = formValueSelector(formName)

const mapStateToProps = (state: RootState) => ({
  isSalePermanent: !!formValue(state, 'permanentSale'),
  isPurchasePermanent: !!formValue(state, 'permanentPurchase'),
  isPercentagePaused: state.whitelist.percentageTM.isPaused,
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
        {!this.props.isPercentagePaused ? (
          <div>
            <br />
            <Field
              name='isPercentage'
              component={CheckboxInput}
              label='Exempt from % ownership restriction'
            />
          </div>
        ) : ''}
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
