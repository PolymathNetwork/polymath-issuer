import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import {
  required,
  maxLength,
  integer,
  minValue,
  maxValue,
  url,
} from 'polymath-ui/dist/validate'

export const formName = 'complete_token'

const maxLength100 = maxLength(100)
const minValue0 = minValue(0)
const minValue1 = minValue(1)
const maxValue24 = maxValue(24)
const maxValue1000000000000 = maxValue(1000000000000)

class CompleteTokenForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field
          name='name'
          component={TextInput}
          label='Token name'
          placeholder='Polymath Utility Token'
          validate={[required, maxLength100]}
        />
        <Field
          name='totalSupply'
          component={TextInput}
          label='Total supply'
          validate={[required, integer, minValue1, maxValue1000000000000]}
          placeholder='For example: 1000000'
        />
        <Field
          name='decimals'
          component={TextInput}
          label='Decimals'
          validate={[required, integer, minValue0, maxValue24]}
          placeholder='For example: 8'
        />
        <Field
          name='url'
          component={TextInput}
          label='Website'
          validate={[required, url]}
          placeholder='https://polymath.network'
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
})(CompleteTokenForm)
