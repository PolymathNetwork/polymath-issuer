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
            <h1 className='bx--type-mega'>The Next Mega-Trend in Crypto is the Emergence of Security Tokens</h1>
            <p>&nbsp;</p>
            <h3 className='bx--type-beta'>
              Polymath empowers trillions of dollars of financial securities
              to effortlessly migrate to the blockchain
            </h3>
            <p>&nbsp;</p>
            <p>
              <Link to='/ticker'>
                <Button>
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
