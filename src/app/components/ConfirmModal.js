// @flow

import React, { Component } from 'react'
import { Modal, ModalHeader, Icon } from 'carbon-components-react'

type Props = {|
  isOpen: boolean,
  headerText: string,
  labelText: string,
  confirmText: string,
  bodyText: string,
  labelColor: string,
  modalIcon: string,
  onClose: () => any,
  onSubmit: () => any,
|}

export default class ConfirmModal extends Component<Props> {
  handleSubmit = () => {
    this.props.onSubmit()
  }

  handleClose = () => {
    this.props.onClose()
  }

  render () {
    const { isOpen, onClose, headerText, labelText, labelColor, modalIcon, confirmText, bodyText } = this.props
    return (
      <Modal
        open={isOpen}
        onFocus={this.handleClose}
        onRequestClose={onClose}
        onRequestSubmit={this.handleSubmit}
        primaryButtonText={confirmText}
        secondaryButtonText='Cancel'
      >
        <ModalHeader
          label={<span style={{ color: { labelColor } }}>{labelText}</span>}
          closeModal={onClose}
          title={
            <span>
              <Icon name={`${modalIcon}`} fill='#E71D32' width='24' height='24' />&nbsp; {headerText}
            </span>
          }
        />
        <div className='bx--modal-content__text'>
          <p>{bodyText}</p>
        </div>
      </Modal>
    )
  }
}
