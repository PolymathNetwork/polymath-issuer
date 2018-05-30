// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { Form, Button } from 'carbon-components-react'

import LockupDatesFields, { validate } from './LockupDatesFields'

type StateProps = {|
  isSalePermanent: boolean,
  isPurchasePermanent: boolean,
|}

type Props = {|
  handleSubmit: () => void,
  onClose: () => void,
|} & StateProps

export const formName = 'edit_investors_form'

const formValue = formValueSelector(formName)

const mapStateToProps = (state) => ({
  isSalePermanent: !!formValue(state, 'e_permanentSale'),
  isPurchasePermanent: !!formValue(state, 'e_permanentPurchase'),
})

class EditInvestorsForm extends Component<Props> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <LockupDatesFields
          edit
          isSalePermanent={this.props.isSalePermanent}
          isPurchasePermanent={this.props.isPurchasePermanent}
        />
        <br />
        <p align='right'>
          <Button kind='secondary' onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button type='submit'>
            Edit Lockup Dates
          </Button>
        </p>
      </Form>
    )
  }
}

export default connect(mapStateToProps)(reduxForm({
  form: formName,
  validate,
})(EditInvestorsForm))
