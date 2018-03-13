import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class HomePage extends Component {
  render () {
    return (
      <div>
        <span>Home page.</span><br />
        <Link to='/signup'>Sign Up</Link>
      </div>
    )
  }
}
