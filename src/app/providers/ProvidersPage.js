/* eslint-disable react/jsx-no-bind, jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events */
// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Tabs, Tab, Icon, Checkbox, Button } from 'carbon-components-react'
import type { SecurityToken } from 'polymathjs/types'
import type { RouterHistory } from 'react-router-dom'

import { applyProviders, iHaveMyOwnProviders, setProviderStatus } from './actions'
import NotFoundPage from '../NotFoundPage'
import Progress from '../token/components/Progress'
import { categories } from './data'
import type { RootState } from '../../redux/reducer'
import type { SPStatus, SPCategory, ServiceProvider } from './data'
import ApplyModal from './ApplyModal'

type StateProps = {|
  token: ?SecurityToken,
  providers: ?Array<ServiceProvider>,
|}

type DispatchProps = {|
  applyProviders: (ids: Array<number>) => any,
  iHaveMyOwnProviders: (cat: number) => any,
  setProviderStatus: (id: number, status: SPStatus) => any,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  providers: state.providers.data,
  token: state.token.token,
})

const mapDispatchToProps: DispatchProps = {
  applyProviders,
  iHaveMyOwnProviders,
  setProviderStatus,
}

type State = {|
  selected: Array<number>,
  tabSelected: number,
  selectAll: boolean,
  isApply: boolean,
  catName: string,
|}

type Props = {|
  history: RouterHistory,
|} & StateProps & DispatchProps

class ProvidersPage extends Component<Props, State> {

  state = {
    selected: [],
    tabSelected: 0,
    selectAll: false,
    isApply: false,
    catName: '',
  }

  handleTabClick = (tabSelected, catName) => {
    this.setState({
      selected: [],
      tabSelected,
      selectAll: false,
      catName,
    })
  }

  handleProviderClick = (provider: ServiceProvider) => {
    if (provider.progress && provider.progress.isApplied) {
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
        if (p.cat === this.state.tabSelected && (!p.progress || !p.progress.isApplied)) {
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
    this.setState({ isApply: false, selected: [], selectAll: false })
  }

  handleIHaveMyOwn = () => {
    this.props.iHaveMyOwnProviders(this.state.tabSelected)
  }

  handleCreateToken = () => {
    this.handleIHaveMyOwn()
    // $FlowFixMe
    this.props.history.push('/dashboard/' + this.props.token.ticker)
  }

  render () {
    const { token, providers } = this.props
    if (!token || !providers) {
      return <NotFoundPage />
    }
    if (this.state.catName === '') {
      this.setState({ catName: categories[0].title })
    }
    return (
      <DocumentTitle title={`${token.ticker} Providers – Polymath`}>
        <div>
          <Progress />
          <div className='remark'>
            <span>Data Privacy</span>
            None of your data entered in the application form(s) is stored on Polymath servers or shared with any
            third party other than the firm(s) you decide to apply for.
          </div>
          <h1 className='pui-h1'>Choose Your Providers</h1>
          <h3 className='pui-h3'>
            Your Polymath dashboard is integrated with several providers to streamline your on-boarding process and
            access to their services. The information you enter in each associated form will be sent automatically to
            the firm(s) you apply for. Upon review of your information, the firm(s) will contact you directly to
            establish the applicable next steps.<br /><br />
            To get started, please select an Advisory provider, a Legal provider or both. Note that you don’t need
            to select all at the same time nor have any obligation to select any of the providers below.
            You can always elect to use your own.
          </h3>
          <Button
            kind='secondary'
            onClick={this.handleCreateToken}
            style={{ float: 'right', marginTop: '47px', position: 'relative', zIndex: 9 }}
          >
            Create Your Token
          </Button>
          <Tabs selected={this.state.tabSelected}>
            {categories.map((cat: SPCategory) => (
              <Tab
                key={cat.id}
                label={cat.title}
                onClick={() => this.handleTabClick(cat.id, cat.title)}
                href={'#' + cat.id}
              >
                <div>
                  <h2 className='pui-h2'>{cat.title}</h2>
                  <h4 className='pui-h4' style={{ width: '721px', float: 'left' }}>{cat.desc}</h4>
                  <div className='providers-controls'>
                    <Checkbox
                      id='select-all-providers'
                      onClick={this.handleSelectAll}
                      checked={this.state.selectAll}
                      labelText='Select all'
                    />
                    <Button
                      disabled={this.state.selected.length === 0}
                      onClick={this.handleStartApply}
                    >
                      Apply to selected
                    </Button>
                    <Button kind='secondary' onClick={this.handleIHaveMyOwn}>I have my own</Button>
                  </div>
                  <div className='pui-clearfix' />
                  <div className='providers pui-no-select'>
                    {providers.map((p: ServiceProvider) => p.cat !== cat.id ? '' : (
                      <div
                        role='button'
                        key={p.id}
                        onClick={() => this.handleProviderClick(p)}
                        className={
                          'provider' +
                          (this.state.selected.includes(p.id) ? ' provider-selected' : '') +
                          (p.progress && p.progress.isApplied ? ' provider-applied' : '')
                        }
                      >
                        {p.progress && p.progress.isApplied ? (
                          <div className='provider-applied'>
                            Applied
                            <Icon
                              name='checkmark--glyph'
                              fill='#00AA5E'
                            />
                          </div>
                        ) : ''}
                        <div className='provider-img'><img src={p.logo} alt={p.title} /></div>
                        <h3 className='pui-h3'>{p.title}</h3>
                        <p>{p.desc}</p>
                        {p.disclosure ? (
                          <div className='remark'>
                            <span>Disclosure</span>
                            {p.disclosure}
                          </div>
                        ) : ''}
                      </div>
                    ))}
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
          <div className='pui-clearfix' />
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProvidersPage)
