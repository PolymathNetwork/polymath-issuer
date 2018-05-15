// @flow

import React, { Component } from 'react'
import { reduxForm } from 'redux-form'

import { Form, FormGroup, Button, RadioButtonGroup, RadioButton, Tooltip } from 'carbon-components-react'

export const formName = 'complete_token'

type Props = {
  handleSubmit: (isDivisible: boolean) => void,
}

type State = {|
  isDivisible: boolean,
|}

class CompleteTokenForm extends Component<Props, State> {

  state = {
    isDivisible: false,
  }

  handleChange = (value) => {
    this.setState({ isDivisible: Number(value) === 1 })
  }
  
  handleSubmit = () => {
    this.props.handleSubmit(this.state.isDivisible)
  }

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <FormGroup legendText={(
          <Tooltip triggerText='My Security Token Must Be'>
            <p className='bx--tooltip__label'>
              Divisible or Indivisible token
            </p>
            <p>
              TODO @Thomas
            </p>
          </Tooltip>
        )}
        >
          <RadioButtonGroup
            onChange={this.handleChange}
            name='radio-button-group'
            defaultSelected='0'
          >
            <RadioButton
              value='1'
              id='radio-divisible'
              labelText='Divisible'
            />
            <RadioButton
              value='0'
              labelText='Indivisible'
              id='radio-indivisible'
            />
          </RadioButtonGroup>
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
