import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Button } from 'carbon-components-react'
import { logo } from 'polymath-ui'

export default class SplashPage extends Component {
  render () {
    return (
      <DocumentTitle title='Polymath'>
        <div className='bx--row'>
          <div className='splash-background-pattern' />
          <div className='splash-background' />
          <div className='bx--col-xs-8'>
            <img src={logo} alt='Logo' className='splash-logo' />
            <h1 className='pui-h0'>The Next Mega-Trend<br />in Crypto is the Emergence<br /> of Securities Tokens</h1>
            <h3 className='pui-h3'>
              Polymath enables trillions of dollars of securities
              to be issued<br /> and traded on the blockchain.
            </h3>
            <br /><br />
            <p>
              <Link to='/ticker'>
                <Button icon='arrow--right'>
                  ISSUE YOUR SECURITY TOKEN
                </Button>
              </Link>
            </p>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
