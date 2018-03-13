import PropTypes from 'prop-types'
import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import routes from './routes'

class RouteLoader extends Component {
  static contextTypes = {
    store: PropTypes.object,
  };

  render () {
    return renderRoutes(routes)
  }
}

export default withRouter(RouteLoader)
