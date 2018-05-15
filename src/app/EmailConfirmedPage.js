// @flow

import React from 'react'
import { Redirect } from 'react-router'

const EmailConfirmedPage = () => (
  <Redirect
    to={{
      pathname: '/ticker/success',
      state: { fromEmailConfirmation: true },
    }}
  />
)
export default EmailConfirmedPage
