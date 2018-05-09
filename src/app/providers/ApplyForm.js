// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Form, Tooltip } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import {
  required,
  maxLength,
  email,
  url,
} from 'polymath-ui/dist/validate'

export const formName = 'providers_apply'

const maxLength100 = maxLength(100)

type Props = {|
  onSubmit: () => any,
|}

class ApplyForm extends Component<Props> {

  render () {
    return (
      <Form onSubmit={this.props.onSubmit}>
        <Field
          name='name'
          component={TextInput}
          label='Issuer Name'
          placeholder='Enter your name'
          validate={[required, maxLength100]}
        />
        <Field
          name='email'
          component={TextInput}
          label='Issuer Email'
          placeholder='Enter your contact email'
          validate={[required, email]}
        />
        <Field
          name='company'
          component={TextInput}
          label='Company Name'
          placeholder='Enter company name'
          validate={[required, maxLength100]}
        />
        <Field
          name='desc'
          component={TextInput}
          label='Company Description'
          placeholder='Enter company description'
          validate={[required, maxLength100]}
        />
        <Field
          name='operationJurisdiction'
          component={TextInput}
          label='Jurisdiction of Operation'
          placeholder='Enter jurisdiction of operation'
        />
        <Field
          name='incorporationJurisdiction'
          component={TextInput}
          label='Jurisdiction of Incorporation'
          placeholder='Enter jurisdiction of incorporation'
        />
        <Field
          name='presentationUrl'
          component={TextInput}
          label={
            <Tooltip triggerText='Corporate/Project Presentation'>
              <p className='bx--tooltip__label'>
                Links
              </p>
              <p>
                Paste links to the file/folder from your preferred file sharing service.<br />
                For example: Dropbox, Google Drive, etc.
              </p>
            </Tooltip>
          }
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='profilesUrl'
          component={TextInput}
          label='Management and Board Member Profiles'
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='structureUrl'
          component={TextInput}
          label='Corporate or Project Structure/Organization'
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='details'
          component={TextInput}
          label='Other Details'
          placeholder='Start text here'
          validate={[maxLength100]}
        />
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(ApplyForm)
