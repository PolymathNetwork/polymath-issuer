import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
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
    return (
      <div className='bx--grid'>
        {renderRoutes(this.props.route.routes)}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  network: state.network,
})

const mapDispatchToProps = (dispatch) => ({
  setupHistory: (history) => dispatch(setupHistory({ history })),
  txHash: (hash) => dispatch(txHash({ hash })),
  txEnd: (receipt) => dispatch(txEnd({ receipt })),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
