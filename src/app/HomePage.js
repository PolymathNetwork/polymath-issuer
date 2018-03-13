import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Button } from 'carbon-components-react'

export default class HomePage extends Component {
  render () {
    return (
      <DocumentTitle title='Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-8'>
            <p className='bx--type-mega'>The Next Mega-Trend in Crypto is the Emergence of Security Tokens</p>
            <p>&nbsp;</p>
            <p className='bx--type-beta'>
              Polymath empowers trillions of dollars of financial securities
              to effortlessly migrate to the blockchain.
            </p>
            <p>&nbsp;</p>
            <p>
              <Link to='/signup'>
                <Button>
                  Sign Up
                </Button>
              </Link>
            </p>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
