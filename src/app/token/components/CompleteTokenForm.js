// @flow

import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Form, FormGroup, Button, Tooltip, Toggle } from 'carbon-components-react'
import { TextInput, RadioInput } from 'polymath-ui'
import { url, required, integer, minValue } from 'polymath-ui/dist/validate'

export const formName = 'complete_token'

const minValue1 = minValue(1)

type Props = {
  handleSubmit: (isDivisible: boolean) => void,
  onToggle: (isToggled: boolean) => void,
  isToggled: boolean,
}

class CompleteTokenForm extends Component<Props> {

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit} className='token-form'>
        <div className='token-form-left'>
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
          <FormGroup
            style={{ marginTop: '8px' }}
            legendText={(
              <Tooltip triggerText='Limit the Number of Investors Who Can Hold This Token'>
                <p className='bx--tooltip__label'>
                  Limit the Number of Investors
                </p>
                <p>
                  This option allows you to limit the number of concurrent token holders
                  irrespective of the number of entries in the whitelist.<br />
                  For example, enabling this option can allow you to allow a maximum of 99
                  concurrent token holders while your whitelist may have thousands of entries.
                </p>
              </Tooltip>
            )}
          >
            <Toggle onToggle={this.props.onToggle} id='investors-number-toggle' />
          </FormGroup>
        </div>
        <div className='token-form-right'>
          <FormGroup legendText={(
            <Tooltip triggerText='Additional Token Information'>
              <p className='bx--tooltip__label'>
                Additional Token Information
              </p>
              <p>
                Paste link to a shared file or folder that includes additional
                information on your token, such as legend.
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
          {this.props.isToggled ? (
            <FormGroup legendText='Max. Number of Investors' style={{ marginTop: '24px' }}>
              <Field
                name='investorsNumber'
                component={TextInput}
                placeholder='Enter the number'
                validate={[required, integer, minValue1]}
              />
            </FormGroup>
          ) : ''}
        </div>
        <div className='pui-clearfix' />
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
