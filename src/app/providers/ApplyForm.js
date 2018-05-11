// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Form, Tooltip, Button } from 'carbon-components-react'
import { TextInput, TextAreaInput } from 'polymath-ui'
import {
  required,
  maxLength,
  url,
} from 'polymath-ui/dist/validate'

export const formName = 'providers_apply'

const maxLength100 = maxLength(100)
const maxLength300 = maxLength(300)

type Props = {|
  onSubmit: () => any,
|}

const linkTooltip = (title: string) => (
  <Tooltip triggerText={title}>
    <p className='bx--tooltip__label'>
      Links
    </p>
    <p>
      Paste links to the file/folder from your preferred file sharing service.<br />
      For example: Dropbox, Google Drive, etc.
    </p>
  </Tooltip>
)

class ApplyForm extends Component<Props> {

  render () {
    return (
      <Form onSubmit={this.props.onSubmit}>
        <Field
          name='company'
          component={TextInput}
          label='Company Name'
          placeholder='Enter company name'
          validate={[required, maxLength100]}
        />
        <Field
          name='desc'
          component={TextAreaInput}
          label='Company Description'
          placeholder='Enter company description'
          validate={[required, maxLength300]}
        />
        <Field
          name='operationJurisdiction'
          component={TextInput}
          label='Jurisdiction of Operation'
          placeholder='Enter jurisdiction of operation'
          validate={[required, maxLength100]}
        />
        <Field
          name='incorporationJurisdiction'
          component={TextInput}
          label='Jurisdiction of Incorporation'
          placeholder='Enter jurisdiction of incorporation'
          validate={[required, maxLength100]}
        />
        <Field
          name='presentationUrl'
          component={TextInput}
          label={linkTooltip('Corporate/Project Presentation')}
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='profilesUrl'
          component={TextInput}
          label={linkTooltip('Management and Board Member Profiles')}
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='structureUrl'
          component={TextInput}
          label={linkTooltip('Corporate or Project Structure/Organization')}
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='details'
          component={TextAreaInput}
          label='Other Details'
          placeholder='Start text here'
          validate={[maxLength300]}
        />
        <p align='right'>
          <Button type='submit' style={{ width: '154px' }}>
            Submit
          </Button>
        </p>
        <p className='pui-input-hint'>
          When you click submit, an email which contains the information entered on that screen will be sent to the
          Advisory firm(s) you have selected. None of this information is stored on Polymath servers, only your
          browser&apos;s cache. To clear this information, simply clear your browser&apos;s cache.
        </p>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(ApplyForm)
