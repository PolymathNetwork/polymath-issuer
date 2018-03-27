// @flow

import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'

export default class DashboardPage extends Component<{}> {
  render () {
    return (
      <DocumentTitle title='Dashboard – Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-8'>
            <h1 className='bx--type-mega'>Dashboard</h1>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
