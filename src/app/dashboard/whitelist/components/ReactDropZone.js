import Dropzone from 'react-dropzone'
import React, { Component } from 'react'

import '../style.css'

type Props = {
  onHandleUpload: Function
}

const dropzoneStyle = {
  height: '72px',
  width: '404px',
}

export default class BasicDropzone extends Component<Props> {
  onDrop (files) {
    this.props.onHandleUpload(files[0])
  }

  render () {
    return (
      <section id='rectangle-6'>
        <div>
          <Dropzone
            // eslint-disable-next-line
            onDrop={this.onDrop.bind(this)}
            style={dropzoneStyle}
          >
            <p id='placeholder' >Drop file here</p>
          </Dropzone>
        </div>
      </section>
    )
  }
}
