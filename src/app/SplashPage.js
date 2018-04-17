import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Button } from 'carbon-components-react'

export default class SplashPage extends Component {
  render () {
    return (
      <DocumentTitle title='Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-8'>
            <h1 className='pui-h0'>The Next Mega-Trend in Crypto is the Emergence of Security Tokens</h1>
            <h3 className='pui-h3'>
              Polymath empowers trillions of dollars of financial securities
              to be issued and traded on the blockchain.
            </h3>
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
