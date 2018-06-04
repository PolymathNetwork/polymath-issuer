import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Button } from 'carbon-components-react'
import { logo } from 'polymath-ui'
import illustration from './illustration.png'

export default class DummyPage extends Component {
  render () {
    return (
      <DocumentTitle title='Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-12 dummy-page'>
            <img src={logo} alt='Logo' className='logo-dark' />
            <img src={illustration} alt='Illustration' />
            <h3>
              The creation of your security token requires interaction with the <span>Metamask</span> browser extension.
              Please use your desktop browser to proceed with this operation
            </h3>
            <p>
              <a href='https://polymath.network'>
                <Button icon='arrow--left'>Back to The Homepage</Button>
              </a>
            </p>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
