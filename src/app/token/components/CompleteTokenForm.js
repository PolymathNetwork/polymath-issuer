// @flow

import React, { Component } from 'react'
import { reduxForm } from 'redux-form'

import { Form, Button } from 'carbon-components-react'

export const formName = 'complete_token'

type Props = {
  handleSubmit: () => void,
}

class CompleteTokenForm extends Component<Props> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Button type='submit'>
          PROCEED WITH TOKEN ISSUANCE
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
