import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import Contract from 'polymath.js_v2'

import 'carbon-components/css/carbon-components.min.css'
import './style.css'

import { setupHistory, txHash, txEnd } from './ui/actions'

class App extends Component {
  static propTypes = {
    route: PropTypes.shape({
      routes: PropTypes.array,
    }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }),
    }).isRequired,
    setupHistory: PropTypes.func.isRequired,
    // eslint-disable-next-line
    network: PropTypes.object.isRequired,
    txHash: PropTypes.func.isRequired,
    txEnd: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadingMessage: PropTypes.string,
    miningTxHash: PropTypes.string,
  }

  componentWillMount () {
    this.props.setupHistory(this.props.history)
    Contract.params = {
      ...this.props.network,
      txHashCallback: (hash) => this.props.txHash(hash),
      txEndCallback: (receipt) => this.props.txEnd(receipt),
    }
  }

  render () {
    if (this.props.isLoading) {
      const hash = this.props.miningTxHash
      return (
        <DocumentTitle title={this.props.loadingMessage}>
          <div className='bx--grid'>
            <h3 className='bx--type-beta'>{this.props.loadingMessage}</h3>
            {hash ? (
              <p>
                <br />
                Transaction hash:{' '}
                <Link to={'https://ropsten.etherscan.io/tx/' + hash}>{hash}</Link>
              </p>
            ) : ''}
          </div>
        </DocumentTitle>
      )
    }
    return (
      <div className='bx--grid'>
        {renderRoutes(this.props.route.routes)}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  network: state.network,
  isLoading: state.ui.isLoading,
  loadingMessage: state.ui.loadingMessage,
  miningTxHash: state.ui.txHash,
})

const mapDispatchToProps = (dispatch) => ({
  setupHistory: (history) => dispatch(setupHistory({ history })),
  txHash: (hash) => dispatch(txHash({ hash })),
  txEnd: (receipt) => dispatch(txEnd({ receipt })),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
