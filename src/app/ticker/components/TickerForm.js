// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button } from 'carbon-components-react'
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
        <Field
          name='ticker'
          component={TextInput}
          label='Enter token symbol'
          placeholder='POLY'
        />
        <Field
          name='name'
          component={TextInput}
          label='Enter token name'
          placeholder='Polymath Network Token'
          validate={[required, maxLength100]}
        />
        <Field
          name='owner'
          component={TextInput}
          label='Owner'
          disabled
          validate={[required, ethereumAddress]}
        />
        <Field
          name='company'
          component={TextInput}
          label='Company name'
          validate={[maxLength100]}
        />
        <Field
          name='desc'
          component={TextInput}
          label='Company description'
          validate={[maxLength100]}
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
      console.error('Error fetching details', err)
    }

    if (details !== null) {
      // eslint-disable-next-line
      throw { ticker: 'Specified ticker is already exists.' }
    }
  },
  asyncBlurFields: ['ticker'],
})(TickerForm)
