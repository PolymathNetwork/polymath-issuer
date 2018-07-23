// @flow

import React, { Component, Fragment } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { STOStatus, Remark } from 'polymath-ui'
import type { SecurityToken, STOPurchase, STODetails } from 'polymathjs'
import { Icon, ComposedModal, ModalHeader, ModalBody, ModalFooter, Button } from 'carbon-components-react'

import NotFoundPage from '../../NotFoundPage'
import InvestorTable from './InvestorTable'
import { fetchPurchases, togglePauseSto, getPauseStatus  } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  token: ?SecurityToken,
  details: ?STODetails,
  purchases: Array<STOPurchase>,
  isStoPaused: boolean,
  isConfirmationModalOpen: boolean
|};

type DispatchProps = {|
  fetchPurchases: () => any,
  togglePauseSto: (endDate: Date) => any,
  getPauseStatus: () => any
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  details: state.sto.details,
  purchases: state.sto.purchases,
  isStoPaused: state.sto.pauseStatus,
  isConfirmationModalOpen: false,
})

const mapDispatchToProps: DispatchProps = {
  fetchPurchases,
  togglePauseSto,
  getPauseStatus,
}

type Props = {|
|} & StateProps & DispatchProps

type State = {|
  isConfirmationModalOpen: boolean,
|}

class OverviewSTO extends Component<Props, State> {

  state = {
    isConfirmationModalOpen: false,
  }

  componentWillMount () {
    this.props.fetchPurchases()
  }

  handleConfirm = () => {
    this.setState({ isConfirmationModalOpen: false })
    this.toggleStoPause()
  }

  handleConfirmationCancel = () => {
    this.setState({ isConfirmationModalOpen: false })
  }

  onHandleCompleteSubmit = () => {
    this.setState({ isConfirmationModalOpen: true })
  }

  toggleStoPause = () => {
    // $FlowFixMe
    this.props.togglePauseSto(this.props.details.end)
  };

  render () {
    const { token, details, purchases } = this.props
    if (!token || !details) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`${token.ticker} STO Overview – Polymath`}>
        <div>
          <ComposedModal open={this.state.isConfirmationModalOpen} className='pui-confirm-modal'>
            <ModalHeader
              label='Confirmation required'
              title={
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />
                  &nbsp; Before You Proceed with {this.props.isStoPaused ? 'Resuming':'Pausing'} the STO
                </span>
              }
            />
            <ModalBody>
              <div className='bx--modal-content__text'>
                {this.props.isStoPaused ? (
                  <div>
                    <p>
                    Once you hit &laquo;CONFIRM&raquo;, the STO will resume, allowing Investors to contribute funds
                     again. Please consult with your Advisor and provide your Investors with sufficient disclosure prior
                      to confirming the action.
                      <br />If you are not sure or would like to consult your Advisor,
                       simply select &laquo;CANCEL&raquo;.
                    </p>
                    <br />
                    <Remark title='Note'>
                  Your offering end-date will not be changed as a result of this operation.   
                    </Remark>
                  </div>
                ) : (
                  <p>
                    Once you hit &laquo;CONFIRM&raquo;, the STO will pause and Investors will no longer be able to
                     contribute funds. Please consult with your Advisor and provide your Investors with sufficient
                      disclosure prior to confirming the action.
                    <br />
                    If you are not sure or would like to consult your Advisor, simply select &laquo;CANCEL&raquo;.
                  </p>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button kind='secondary' onClick={this.handleConfirmationCancel}>
                CANCEL
              </Button>
              <Button onClick={this.handleConfirm}>CONFIRM</Button>
            </ModalFooter>
          </ComposedModal>
          <Fragment>
            <h1 className='pui-h1'>Security Token Overview</h1>
            <br />
            <STOStatus
              toggleStoPause={this.onHandleCompleteSubmit}
              details={details}
              token={token}
              isStoPaused={this.props.isStoPaused}
            />
            <br />
            <br />
            <h2 className='pui-h2'>List of Investors</h2>
            <div className={this.props.isStoPaused ? ' pui-paused' : ''}>
              <InvestorTable isStoPaused={this.props.isStoPaused} rows={purchases} />
            </div>
            <p>&nbsp;</p>
          </Fragment>
        </div>
      </DocumentTitle>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewSTO)
