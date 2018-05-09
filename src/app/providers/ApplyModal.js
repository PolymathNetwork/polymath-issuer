// @flow

import React, { Component } from 'react'
import { Modal } from 'carbon-components-react'

import ApplyForm from './ApplyForm'

type Props = {|
  isOpen: boolean,
  catName: string,
  onClose: () => any,
  onSubmit: () => any,
|}

export default class ApplyModal extends Component<Props> {

  render () {
    const { isOpen, catName, onClose, onSubmit } = this.props
    return (
      <Modal
        open={isOpen}
        onRequestClose={onClose}
        onRequestSubmit={onSubmit}
        modalHeading={'Apply to ' + catName + ' Providers'}
        primaryButtonText='Submit'
        secondaryButtonText='Cancel'
      >
        <h4 className='pui-h4'>
          The information you enter below will be sent to the {catName} Providers your selected.
        </h4>
        <ApplyForm onSubmit={onSubmit} />
      </Modal>
    )
  }
}
