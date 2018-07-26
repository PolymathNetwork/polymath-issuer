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
  handleSubmit: () => void,
  onClose: () => void,
|}

const linkTooltip = (title: string, required: boolean) => (
  <Tooltip triggerText={<p>{title} { required ? <span className='polyRequiredRed'>*</span> : '' } </p>}>
    <p className='bx--tooltip__label'>
      Linkso
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
      <Form onSubmit={this.props.handleSubmit}>
        <Field
          name='companyName'
          component={TextInput}
          label={<p>Company Name <span className='polyRequiredRed'>*</span> </p>}
          placeholder='Enter company name'
          validate={[required, maxLength100]}
        />
        <Field
          name='companyDesc'
          component={TextAreaInput}
          label={<p>Company Description <span className='polyRequiredRed'>*</span> </p>}
          placeholder='Enter company description'
          validate={[required, maxLength300]}
        />
        <Field
          name='operatedIn'
          component={TextInput}
          label={<p>Jurisdiction of Operation <span className='polyRequiredRed'>*</span> </p>}
          placeholder='Enter jurisdiction of operation'
          validate={[required, maxLength100]}
        />
        <Field
          name='incorporatedIn'
          component={TextInput}
          label={<p>Jurisdiction of Incorporation<span className='polyRequiredRed'>*</span> </p>}
          placeholder='Enter jurisdiction of incorporation'
          validate={[required, maxLength100]}
        />
        <Field
          name='projectURL'
          component={TextInput}
          label={linkTooltip('Corporate/Project Presentation', true)}
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='profilesURL'
          component={TextInput}
          label={linkTooltip('Management and Board Member Profiles', true)}
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='structureURL'
          component={TextInput}
          label={linkTooltip('Corporate or Project Structure/Organization', true)}
          placeholder='Paste link here'
          validate={[required, url]}
        />
        <Field
          name='otherDetails'
          component={TextAreaInput}
          label='Other Details'
          placeholder='Start text here'
          validate={[maxLength300]}
        />
        <p align='right'>
          <Button kind='secondary' onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button type='submit' style={{ width: '154px' }}>
            Submit
          </Button>
        </p>
        <p className='pui-input-hint'>
          When you click submit, an email which contains the information entered on that screen will be sent to the
          Advisory firm(s) you have selected. None of this information is stored on Polymath servers, only your
          browser&apos;s cache. To clear this information, simply clear your browser&apos;s cache.
        </p>
        <br />
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(ApplyForm)
