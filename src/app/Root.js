// @flow

import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import type { Node } from 'react'

import 'carbon-components/css/carbon-components.min.css'
import 'polymath-ui/dist/style.css'
import './style.css'

type Props = {|
  route?: Object,
  children: ?Node,
|}

export default class Root extends Component<Props> {
  render () {
    const { children, route } = this.props
    return (
      <div className='bx--grid'>
        {children || (route ? renderRoutes(route.routes) : null)}
      </div>
    )
  }
}
