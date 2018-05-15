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
  Icon,
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
    this.setState({ isModalOpen: false })
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
              <ComposedModal open={this.state.isModalOpen} className='pui-confirm-modal'>
                <ModalHeader
                  label='Confirmation required'
                  title={(
                    <span>
                      <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                      Before You Launch Your Security Token Offering
                    </span>
                  )}
                />
                <ModalBody>
                  <div className='bx--modal-content__text'>
                    <p>
                      Once submitted to the blockchain, the dates for your
                      offering cannot be changed.
                    </p>
                    <p>
                      Please confirm dates with your Advisor and Legal
                      providers before you click on &laquo;LAUNCH&raquo;.
                    </p>
                    <p>
                      Investors must be added to the whitelist before or while
                      the STO is live, so they can participate to your
                      fundraise.
                    </p>
                    <p>
                      All necessary documentation must be posted on your
                      Securities Offering Site.
                    </p>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button kind='secondary' onClick={this.handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={this.handleConfirm}>LAUNCH</Button>
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
