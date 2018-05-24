/* eslint-disable react/jsx-no-bind, jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events, react/jsx-handler-names */
// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import {
  Tabs,
  Tab,
  Icon,
  Checkbox,
  Button,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'carbon-components-react'
import { Countdown } from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'
import type { RouterHistory } from 'react-router-dom'

import {
  applyProviders,
  iHaveMyOwnProviders,
  setProviderStatus
} from './actions'
import NotFoundPage from '../NotFoundPage'
import Progress from '../token/components/Progress'
import { categories } from './data'
import type { RootState } from '../../redux/reducer'
import type { SPStatus, SPCategory, ServiceProvider } from './data'
import ApplyModal from './ApplyModal'

type StateProps = {|
  token: ?SecurityToken,
  providers: ?Array<ServiceProvider>
|}

type DispatchProps = {|
  applyProviders: (ids: Array<number>) => any,
  iHaveMyOwnProviders: (cat: number) => any,
  setProviderStatus: (id: number, status: SPStatus) => any
|}

const mapStateToProps = (state: RootState): StateProps => ({
  providers: state.providers.data,
  token: state.token.token
})

const mapDispatchToProps: DispatchProps = {
  applyProviders,
  iHaveMyOwnProviders,
  setProviderStatus
}

type State = {|
  selected: Array<number>,
  tabSelected: number,
  selectAll: boolean,
  isApply: boolean,
  catName: string,
  isModalOpen: boolean
|}

type Props = {|
  history: RouterHistory
|} & StateProps &
  DispatchProps

class ProvidersPage extends Component<Props, State> {
  state = {
    selected: [],
    tabSelected: 0,
    selectAll: false,
    isApply: false,
    catName: '',
    isModalOpen: false
  }

  componentWillMount = () => {
    if (this.state.catName === '') {
      this.setState({ catName: categories[0].title })
    }
  }

  handleTabClick = (tabSelected, catName) => {
    this.setState({
      selected: [],
      tabSelected,
      selectAll: false,
      catName
    })
  }

  handleProviderClick = (provider: ServiceProvider) => {
    if (
      (provider.progress && provider.progress.isApplied) ||
      provider.isToBeAnnounced
    ) {
      return
    }
    const { selected } = this.state
    const index = selected.indexOf(provider.id)
    if (index > -1) {
      selected.splice(index, 1)
    } else {
      selected.push(provider.id)
    }
    this.setState({ selected, tabSelected: provider.cat })
  }

  handleSelectAll = () => {
    const { providers } = this.props
    const isChecked = !this.state.selectAll
    let selected = []
    if (isChecked) {
      // $FlowFixMe
      for (let p: ServiceProvider of providers) {
        if (
          p.cat === this.state.tabSelected &&
          (!p.progress || !p.progress.isApplied) &&
          !p.isToBeAnnounced
        ) {
          selected.push(p.id)
        }
      }
    }
    this.setState({ selected, selectAll: isChecked })
  }

  handleStartApply = () => {
    this.setState({ isApply: true })
  }

  handleCancelApply = () => {
    this.setState({ isApply: false })
  }

  handleApply = () => {
    this.props.applyProviders(this.state.selected)
    this.next()
  }

  handleIHaveMyOwn = (cat: ?number) => {
    this.props.iHaveMyOwnProviders(
      cat === null || cat === undefined ? this.state.tabSelected : cat
    )
    this.next()
  }

  handleCreateToken = () => {
    this.setState({ isModalOpen: true })
  }

  handleConfirmCreate = () => {
    this.setState({ isModalOpen: false })
    this.handleIHaveMyOwn(0)
    // $FlowFixMe
    this.props.history.push('/dashboard/' + this.props.token.ticker)
  }

  handleCancelCreate = () => {
    this.setState({ isModalOpen: false })
  }

  applied = (cat: number): number => {
    const { providers } = this.props
    let applied = 0
    let isPassed = false
    // $FlowFixMe
    for (let p: ServiceProvider of providers) {
      if (p.cat === cat && p.progress) {
        isPassed = true
        if (p.progress.isApplied) {
          applied++
        }
      }
    }
    return isPassed ? applied : -1
  }

  next = () => {
    let tabSelected = this.state.tabSelected
    const isLastCat = tabSelected + 1 === categories.length
    if (!isLastCat) {
      tabSelected++
    }
    let { catName } = this.state
    categories.map((cat: SPCategory) => {
      if (cat.id === tabSelected) {
        catName = cat.title
      }
    })
    this.setState({
      isApply: false,
      selected: [],
      selectAll: false,
      tabSelected,
      catName
    })
  }

  render() {
    const { token, providers } = this.props
    if (!token || !providers) {
      return <NotFoundPage />
    }
    return (
      <DocumentTitle title={`${token.ticker} Providers – Polymath`}>
        <div>
          <Progress />
          <ComposedModal
            open={this.state.isModalOpen}
            className="pui-confirm-modal"
          >
            <ModalHeader
              title={
                <span>
                  <Icon
                    name="warning--glyph"
                    fill="#EFC100"
                    width="24"
                    height="24"
                  />&nbsp; Before You Proceed
                </span>
              }
            />
            <ModalBody>
              <div className="bx--modal-content__text">
                <p>
                  Please make sure you have received sufficient information from
                  one of the Advisors or the Legal firms listed below or your
                  own advisor before you proceed with the token creation.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={this.handleCancelCreate}>
                Cancel
              </Button>
              <Button onClick={this.handleConfirmCreate}>Create Token</Button>
            </ModalFooter>
          </ComposedModal>
          <div className="remark">
            <div className="remark-label">Data Privacy</div>
            <div>
              None of your data entered in the application form(s) is stored on
              Polymath servers or shared with any third party other than the
              firm(s) you decide to apply for.
            </div>
          </div>
          <h1 className="pui-h1">Choose Your Providers</h1>
          <div className="bx--row">
            <div className="bx--col-xs-7">
              <h3 className="pui-h3">
                Your Polymath dashboard is integrated with several providers to
                streamline your on-boarding process and access to their
                services. The information you enter in each associated form will
                be sent automatically to the firm(s) you apply for. Upon review
                of your information, the firm(s) will contact you directly to
                establish the applicable next steps.<br />
                <br />
                To get started, please select an Advisory provider, a Legal
                provider or both. Note that you don’t need to select all at the
                same time nor have any obligation to select any of the providers
                below. You can always elect to use your own.
              </h3>
            </div>
            <div className="bx--col-xs-5 countdown-container">
              {!token.address && token.expires ? (
                <Countdown
                  title="Time Left to Create Your Token"
                  deadline={token.expires}
                  buttonTitle="Create Your Token Now"
                  handleButtonClick={this.handleCreateToken}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          <Tabs selected={this.state.tabSelected}>
            {categories.map((cat: SPCategory) => (
              <Tab
                key={cat.id}
                label={
                  <div>
                    {cat.title}&nbsp;
                    {this.applied(cat.id) !== -1 ? (
                      <span
                        className={
                          'bx--tag' +
                          (!this.applied(cat.id) ? ' tag-my-own' : '')
                        }
                      >
                        {this.applied(cat.id)
                          ? this.applied(cat.id) + ' Applied'
                          : 'I Have My Own'}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                }
                onClick={() => this.handleTabClick(cat.id, cat.title)}
                href={'#' + cat.id}
              >
                <div>
                  <h2 className="pui-h2">{cat.title}</h2>
                  <h4
                    className="pui-h4"
                    style={{ width: '721px', float: 'left' }}
                  >
                    {cat.desc}
                  </h4>
                  <div className="providers-controls">
                    <Checkbox
                      id="select-all-providers"
                      onClick={this.handleSelectAll}
                      checked={this.state.selectAll}
                      labelText="Select all"
                    />
                    <Button
                      disabled={this.state.selected.length === 0}
                      onClick={this.handleStartApply}
                    >
                      Apply to selected
                    </Button>
                    <Button
                      kind="secondary"
                      onClick={() => this.handleIHaveMyOwn(cat.id)}
                    >
                      I have my own
                    </Button>
                  </div>
                  <div className="pui-clearfix" />
                  <div className="providers pui-no-select">
                    {providers.map(
                      (p: ServiceProvider) =>
                        p.cat !== cat.id ? (
                          ''
                        ) : (
                          <div
                            role="button"
                            key={p.id}
                            onClick={() => this.handleProviderClick(p)}
                            className={
                              'provider' +
                              (this.state.selected.includes(p.id)
                                ? ' provider-selected'
                                : '') +
                              (p.progress && p.progress.isApplied
                                ? ' provider-applied'
                                : '') +
                              (p.isToBeAnnounced
                                ? ' provider-to-be-announced'
                                : '')
                            }
                          >
                            {p.progress && p.progress.isApplied ? (
                              <div className="provider-applied">
                                Applied
                                <Icon name="checkmark--glyph" fill="#00AA5E" />
                              </div>
                            ) : (
                              ''
                            )}
                            <div className="provider-img">
                              <img src={p.logo} alt={p.title} />
                            </div>
                            <h3 className="pui-h3">
                              {p.isToBeAnnounced ? 'SOON...' : p.title}
                            </h3>
                            <p>
                              {p.isToBeAnnounced ? 'To Be Announced' : p.desc}
                            </p>
                            {p.disclosure ? (
                              <div className="remark">
                                <div className="remark-label">Disclosure</div>
                                <div>{p.disclosure}</div>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </Tab>
            ))}
          </Tabs>
          <ApplyModal
            catName={this.state.catName}
            isOpen={this.state.isApply}
            onClose={this.handleCancelApply}
            onSubmit={this.handleApply}
          />
          <div className="pui-clearfix" />
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProvidersPage)
