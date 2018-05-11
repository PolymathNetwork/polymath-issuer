// @flow

import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import {
  Button,
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'carbon-components-react'
import type { SecurityToken, STOFactory } from 'polymathjs/types'

import NotFoundPage from '../../NotFoundPage'
import STODetails from './STODetails'
import ConfigureSTOForm from './ConfigureSTOForm'
import { configure, goBack } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  factory: ?STOFactory
|}

type DispatchProps = {|
  configure: () => any,
  goBack: () => any
|}

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  factory: state.sto.factory,
})

const mapDispatchToProps: DispatchProps = {
  configure,
  goBack,
}

type Props = {||} & StateProps & DispatchProps

type State = {|
  isModalOpen: boolean,
|}

class ConfigureSTO extends Component<Props, State> {
  state = {
    isModalOpen: false,
  }

  handleSubmit = () => {
    this.setState({ isModalOpen: true })
  }

  handleGoBack = () => {
    this.props.goBack()
  }

  handleConfirm = () => {
    this.props.configure()
  }

  handleCancel = () => {
    this.setState({ isModalOpen: false })
  }

  render () {
    const { token, factory } = this.props
    if (!token || !token.address || !factory) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`Configure ${token.ticker} STO – Polymath`}>
        <div>
          <div className='bx--row'>
            <div className='bx--col-xs-12'>
              <ComposedModal open={this.state.isModalOpen}>
                <ModalHeader
                  label='Confirmation required'
                  title='Before you launch your security token offering'
                />
                <ModalBody>
                  <div className='bx--modal-content__text'>
                    Before you confirm this transaction, please remember the
                    following:
                    <ul className='bx--list--unordered'>
                      <li className='bx--list__item'>
                        Once submitted to the blockchain, the dates for your
                        offering cannot be changed.
                        <ul className='bx--list--nested'>
                          <li className='bx--list__item'>
                            Please confirm dates with your Advisor and Legal
                            providers before you click on CONFIRM
                          </li>
                        </ul>
                      </li>
                      <li className='bx--list__item'>
                        Investors must be added to the whitelist before or while
                        the STO is live, so they can participate to your
                        fundraise
                      </li>
                      <li className='bx--list__item'>
                        All necessary documentation must be posted on your
                        Securities Offering Site
                      </li>
                    </ul>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button kind='secondary' onClick={this.handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={this.handleConfirm}>Confirm</Button>
                </ModalFooter>
              </ComposedModal>
              <Button
                kind='ghost'
                onClick={this.handleGoBack}
                className='pui-go-back'
                icon='arrow--left'
              >
                Go back
              </Button>
              <h1 className='pui-h1'>Security Token Offering Configuration</h1>
              <br />
              <br />
              <div className='bx--row'>
                <div className='bx--col-xs-5'>
                  <div className='pui-page-box'>
                    <ConfigureSTOForm onSubmit={this.handleSubmit} />
                  </div>
                </div>
                <div className='bx--col-xs-7'>
                  <STODetails item={factory} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureSTO)
