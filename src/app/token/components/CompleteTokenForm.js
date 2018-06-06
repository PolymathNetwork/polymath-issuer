// @flow

import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Form, FormGroup, Button, Tooltip } from 'carbon-components-react'
import { TextInput, RadioInput } from 'polymath-ui'
import { url } from 'polymath-ui/dist/validate'

export const formName = 'complete_token'

type Props = {
  handleSubmit: (isDivisible: boolean) => void,
}

class CompleteTokenForm extends Component<Props> {

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit} className='token-form'>
        <FormGroup legendText={(
          <Tooltip triggerText='My Security Token Must Be'>
            <p className='bx--tooltip__label'>
              Divisible or Indivisible token
            </p>
            <p>
              Indivisible tokens are typically used to represent an equity, while divisible tokens may be used to
              represent divisible assets such as bonds. Please connect with your advisor to select the best option.
            </p>
          </Tooltip>
        )}
        >
          <Field
            name='isDivisible'
            options={[
              { label: 'Divisible', value: '0' },
              { label: 'Indivisible', value: '1' },
            ]}
            component={RadioInput}
          />
        </FormGroup>
        <br />
        <FormGroup legendText={(
          <Tooltip triggerText='Additional Token Information'>
            <p className='bx--tooltip__label'>
              Additional Token Information
            </p>
            <p>
              Paste link to a shared file or folder that includes additional information on your token, such as legend.
            </p>
          </Tooltip>
        )}
        >
          <Field
            name='details'
            component={TextInput}
            placeholder='Paste link here'
            validate={[url]}
          />
        </FormGroup>
        <Button type='submit'>
          Create my security token
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
