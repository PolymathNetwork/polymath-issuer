// @flow

import React, { Component } from 'react'

// TODO @bshevchenko: move this component into the polymath-ui repo
export default class NotFoundPage extends Component<{}> {
  render () {
    return (
      <div>
        <p>Segmentation Fault! &ndash; Just kidding it&apos;s only a 404 &ndash; Page Not Found</p><br />
      </div>
    )
  }
}
