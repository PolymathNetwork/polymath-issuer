// @flow

import React, { Component } from 'react'
import { Field } from 'redux-form'
import { CheckboxInput, DatePickerInput } from 'polymath-ui'
import { required, tomorrowOrLater } from 'polymath-ui/dist/validate'

type Props = {|
  isSalePermanent: boolean,
  isPurchasePermanent: boolean,
  edit?: boolean,
|}

const EDIT_PREFIX = 'e_'

export const validate = (values: Object) => {
  const errors = {}
  if (!values.permanentSale && !values[EDIT_PREFIX + 'permanentSale']) {
    errors.sale = required(values.sale) || tomorrowOrLater(values.sale)
  }
  if (!values.permanentPurchase && !values[EDIT_PREFIX + 'permanentPurchase']) {
    errors.purchase = required(values.purchase) || tomorrowOrLater(values.purchase)
  }
  return errors
}

export default class LockupDatesFields extends Component<Props> {

  render () {
    const p = this.props.edit ? EDIT_PREFIX : ''
    return (
      <div>
        <div className='bx--row'>
          <div className='bx--col-xs-6'>
            <Field
              name='sale'
              component={DatePickerInput}
              label='Sale Lockup End Date'
              placeholder='mm / dd / yyyy'
              disabled={this.props.isSalePermanent}
            />
          </div>
          <div className='bx--col-xs-6 permanent-checkbox-container'>
            <Field
              name={p + 'permanentSale'}
              component={CheckboxInput}
              label='Permanent'
            />
          </div>
        </div>
        <div className='bx--row'>
          <div className='bx--col-xs-6'>
            <Field
              name='purchase'
              component={DatePickerInput}
              label='Purchase Lockup End Date'
              placeholder='mm / dd / yyyy'
              disabled={this.props.isPurchasePermanent}
            />
          </div>
          <div className='bx--col-xs-6 permanent-checkbox-container'>
            <Field
              name={p + 'permanentPurchase'}
              component={CheckboxInput}
              label='Permanent'
            />
          </div>
        </div>
      </div>
    )
  }
}
