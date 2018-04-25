import Dropzone from 'react-dropzone'
import React, { Component } from 'react'

import '../style.css'

type Props = {|
  onHandleUpload: Function
|}

//Doing this to override the basic dropzone look
const dropzoneStyle = {
  'height': '100%',
  'width': '100%',
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
}

export default class BasicDropzone extends Component<Props> {
  onDrop (files) {
    this.props.onHandleUpload(files[0])
  }

  render () {
    return (
      <section id='dropzoneRectangle'>
        <Dropzone
          // eslint-disable-next-line
          onDrop={this.onDrop.bind(this)}
          style={dropzoneStyle}
        >
          <p id='dropZoneText' >Drop file here or click to upload</p>
        </Dropzone>
      </section>
    )
  }
}
