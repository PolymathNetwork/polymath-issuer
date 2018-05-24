/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/href-no-hash */
// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button, Tooltip } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import {
  required,
  maxLength,
  alphanumeric,
  ethereumAddress,
} from 'polymath-ui/dist/validate'
import { TickerRegistry } from 'polymathjs'

export const formName = 'ticker'

const maxLength100 = maxLength(100)

type Props = {
  handleSubmit: () => void,
}

class TickerForm extends Component<Props> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <div className='ticker-field'>
          <Field
            name='ticker'
            component={TextInput}
            label='Enter Token Symbol'
            placeholder='4 characters (for example: TORO)'
          />
        </div>
        <Field
          name='name'
          component={TextInput}
          label={
            <Tooltip triggerText='Token Name'>
              <p className='bx--tooltip__label'>
                Token Name
              </p>
              <p>
                This is the name of your token for display purposes.<br />
                For example: Toro Token
              </p>
            </Tooltip>
          }
          placeholder='Enter token name'
          validate={[required, maxLength100]}
        />
        <Field
          name='owner'
          component={TextInput}
          label={
            <Tooltip triggerText='Issuer&apos;s ETH Address'>
              <p className='bx--tooltip__label'>
                Issuer&apos;s ETH Address
              </p>
              <p>
                This ETH address was read from your MetaMask. Only this account will be able to access dashboard and
                complete token issuance and STO.
              </p>
            </Tooltip>
          }
          disabled
          validate={[required, ethereumAddress]}
        />
        <Button type='submit'>
          Reserve token symbol
        </Button>
        <p className='pui-input-hint'>
          By registering your token symbol with Polymath you agree to our <a href='#'>Terms and Conditions</a>.
        </p>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  asyncValidate: async (values) => {
    // async validation doesn't work properly with field-level validation, so we need to specify sync rules here
    const v = values.ticker
    const syncError = required(v) || maxLength(4)(v) || alphanumeric(v)
    if (syncError) {
      // eslint-disable-next-line
      throw { ticker: syncError }
    }
    let details = null
    try {
      details = await TickerRegistry.getDetails(v)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching details', err)
    }

    if (details !== null) {
      // eslint-disable-next-line
      throw { ticker: 'Specified ticker is already exists.' }
    }
  },
  asyncBlurFields: ['ticker'],
})(TickerForm)
