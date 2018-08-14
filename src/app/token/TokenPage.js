// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { FormGroup, Tooltip, Toggle, TextInput, Button } from 'carbon-components-react'
import { etherscanTx, etherscanAddress, Countdown, Remark, confirm } from 'polymath-ui'
import moment from 'moment'
import type { SecurityToken } from 'polymathjs/types'

import {
  issue,
  unlimitNumberOfInvestors,
  limitNumberOfInvestors,
  updateMaxHoldersCount,
  exportMintedTokensList,
} from './actions'
import NotFoundPage from '../NotFoundPage'
import Progress from './components/Progress'
import CompleteTokenForm from './components/CompleteTokenForm'
import MintTokens from './components/MintTokens'
import type { RootState } from '../../redux/reducer'

import './style.css'

type StateProps = {|
  account: ?string,
  token: ?SecurityToken,
  stage: number,
  maxHoldersCount: ?number,
  isCountTMEnabled: boolean,
  isCountTMPaused: boolean,
|}

type DispatchProps = {|
  issue: (isToggled: boolean) => any,
  unlimitNumberOfInvestors: () => any,
  limitNumberOfInvestors: (count?: number) => any,
  updateMaxHoldersCount: (count: number) => any,
  exportMintedTokensList: () => any,
  confirm: () => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  stage: state.sto.stage,
  maxHoldersCount: state.token.countTM.count,
  isCountTMEnabled: !!state.token.countTM.contract,
  isCountTMPaused: state.token.countTM.isPaused,
})

const mapDispatchToProps: DispatchProps = {
  issue,
  unlimitNumberOfInvestors,
  limitNumberOfInvestors,
  updateMaxHoldersCount,
  exportMintedTokensList,
  confirm,
}

type Props = {|
|} & StateProps & DispatchProps

type State = {|
  isToggled: boolean,
  maxHoldersCount: ?number,
|}

class TokenPage extends Component<Props, State> {

  state = {
    isToggled: false,
    maxHoldersCount: undefined,
  }

  componentWillMount () {
    if (this.props.maxHoldersCount) {
      this.setState({ maxHoldersCount: this.props.maxHoldersCount })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.maxHoldersCount !== this.props.maxHoldersCount && nextProps.maxHoldersCount !== null) {
      this.setState({ maxHoldersCount: nextProps.maxHoldersCount })
    }
  }

  handleToggleCreate = (isToggled: boolean) => {
    this.setState({ isToggled })
  }

  handleToggle = (isToggled: boolean) => {
    const { isCountTMEnabled, isCountTMPaused } = this.props
    if (!isCountTMEnabled) {
      this.setState({ isToggled })
    } else {
      if (isCountTMPaused) {
        this.props.limitNumberOfInvestors()
      } else {
        this.props.unlimitNumberOfInvestors()
      }
    }
  }

  handleMaxHoldersCountChange = (event) => {
    if (event.target.value === '') {
      this.setState({ maxHoldersCount: undefined })
    }
    let value = parseInt(Number(event.target.value), 10)
    if (!Number.isInteger(value) || value < 1) {
      event.preventDefault()
      return
    }
    this.setState({ maxHoldersCount: value })
  }

  handleApplyMaxHoldersCount = () => {
    const { isCountTMEnabled } = this.props
    if (isCountTMEnabled) { // $FlowFixMe
      this.props.updateMaxHoldersCount(this.state.maxHoldersCount)
    } else { // $FlowFixMe
      this.props.limitNumberOfInvestors(this.state.maxHoldersCount)
    }
  }

  handleIssue = () => {
    this.props.issue(this.state.isToggled)
  }

  handleExport = () => {
    this.props.exportMintedTokensList()
  }
  // eslint-disable-next-line complexity
  render () {
    const { token, isCountTMEnabled, isCountTMPaused } = this.props
    if (!token) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`${token.ticker} Token – Polymath`}>
        <div>
          <Progress />
          <div>
            <div className='bx--row'>
              {!token.address && token.expires ? (
                <div className='create-token-wrapper'>
                  <div className='pui-page-box'>
                    <div className='token-countdown-container'>
                      <Countdown small title='Time Left' deadline={token.expires} />
                    </div>
                    <h2 className='pui-h2'>
                      Create Your Security Token
                    </h2>
                    <h3 className='pui-h3'>
                      Create your security token before your token reservation expires.
                      If you let your token reservation expire, the token symbol you selected will be
                      available for others to claim.
                    </h3>
                    <h3 className='pui-h3'>
                      To proceed with the creation of your security token,
                      we recommend you work with your Advisory to answer
                      the following questions:
                    </h3>
                    <br />
                    <CompleteTokenForm
                      onToggle={this.handleToggleCreate}
                      isToggled={this.state.isToggled}
                      onSubmit={this.handleIssue}
                    />
                  </div>
                </div>
              ) : ''}
              {token.address && this.props.stage < 3 ? (
                <MintTokens />
              ) : ''}
              <div className='token-symbol-wrapper'>
                <div className='pui-page-box'>
                  <div className='ticker-field'>
                    <div className='bx--form-item'>
                      <label htmlFor='ticker' className='bx--label'>Token Symbol</label>
                      <input
                        type='text'
                        name='ticker'
                        value={token.ticker}
                        id='ticker'
                        readOnly
                        className='bx--text-input bx--text__input'
                      />
                    </div>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='name' className='bx--label'>Token Name</label>
                    <p>{token.name}</p>
                  </div>
                  {token.address ? (
                    <div className='bx--form-item'>
                      <label htmlFor='name' className='bx--label'>Token Address</label>
                      <p>{etherscanAddress(token.address)}</p>
                    </div>
                  ) : ''}
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>
                      {!token.address ? 'Symbol' : 'Token '} Issuance Transaction
                    </label>
                    <p>{etherscanTx(token.txHash)}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='name' className='bx--label'>
                      {!token.address ? 'Symbol' : 'Token '} Issuance Date
                    </label>
                    <p>{moment(token.timestamp).format('D MMMM, YYYY')}</p>
                  </div>
                  <hr />
                  <div className='bx--form-item'>
                    <label htmlFor='name' className='bx--label'>Issuer&apos;s ETH Address</label>
                    <p>{token.owner}</p>
                  </div>
                  {token.address ? (
                    <div>
                      <hr />
                      <FormGroup
                        style={{ marginTop: '8px', width: '260px' }}
                        legendText={(
                          <Tooltip triggerText='Limit the Number of Investors Who Can Hold This Token'>
                            <p className='bx--tooltip__label'>
                              Limit the Number of Investors
                            </p>
                            <p>
                              This option allows you to limit the number of concurrent token holders
                              irrespective of the number of entries in the whitelist.<br />
                              For example, enabling this option can allow you to allow a maximum of 99
                              concurrent token holders while your whitelist may have thousands of entries.
                            </p>
                          </Tooltip>
                        )}
                      >
                        <Toggle
                          onToggle={this.handleToggle}
                          id='investors-number-toggle'
                          toggled={isCountTMEnabled ? !isCountTMPaused : this.state.isToggled}
                        />
                      </FormGroup>
                      <div
                        className='max-holders-count'
                        style={!isCountTMPaused || (!isCountTMEnabled && this.state.isToggled) ? {} : {
                          display: 'none',
                        }}
                      >
                        <Remark title='Note'>
                          If you set the maximum number of investors to a value lower than the current number of
                          investors, only transactions that would result in a reduction of the number of investors
                          will be allowed. All other transactions will fail. Please consult with your Advisory
                          before activating this option.
                        </Remark>
                        <TextInput
                          id='maxHoldersCount'
                          value={this.state.maxHoldersCount}
                          placeholder='Enter the max. number of Investors'
                          onChange={this.handleMaxHoldersCountChange}
                        />
                        <Button
                          onClick={this.handleApplyMaxHoldersCount}
                          disabled={
                            this.state.maxHoldersCount === this.props.maxHoldersCount ||
                            typeof this.state.maxHoldersCount === 'undefined'
                          }
                        >
                          Apply
                        </Button>
                      </div>
                      <br />
                      <hr />
                      <Button
                        icon='download'
                        kind='secondary'
                        onClick={this.handleExport}
                      >
                        Export Minted Tokens List
                      </Button>
                    </div>
                  ) : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenPage)
