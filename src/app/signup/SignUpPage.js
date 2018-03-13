import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { change } from 'redux-form'

import SignUpForm, { formName } from './components/SignUpForm'
import { signup } from './actions'

class SignUpPage extends Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired,
  }

  componentWillMount () {
    this.props.change(this.props.account)
  }

  handleSubmit = () => {
    this.props.signup()
  }

  render () {
    return (
      <DocumentTitle title='Sign Up – Polymath'>
        <div className='bx--row'>
          <div className='bx--col-xs-12'>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to='/'>Home</Link>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className='bx--type-mega'>Token Symbol Registration</h1>
            <p>&nbsp;</p>
            <SignUpForm onSubmit={this.handleSubmit} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.network.account,
})

const mapDispatchToProps = (dispatch) => ({
  change: (value) => dispatch(change(formName, 'address', value)),
  signup: () => dispatch(signup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)
