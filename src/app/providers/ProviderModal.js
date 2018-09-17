// @flow

import React, { Component } from 'react'
import { Modal } from 'carbon-components-react'
import type { ServiceProvider } from './data'

type Props = {|
  isOpen: boolean,
  selected: boolean,
  providerInfo: ServiceProvider,
  onClose: () => any,
  onSubmit: () => any,
|}

export default class ProviderModal extends Component<Props> {

  handleSubmit = () => {
    this.props.onSubmit()
  }

  render () {
    const { isOpen, providerInfo, onClose, onSubmit, selected } = this.props
    return (
      <Modal
        open={isOpen}
        onRequestClose={onClose}
        modalHeading={providerInfo.title}
        primaryButtonDisabled={selected}
        primaryButtonText='Select'
        secondaryButtonText='Cancel'
        onRequestSubmit={onSubmit}
        onSecondarySubmit={onClose}
        className='providers-display-modal'
      >
        <img className='providers-background' src={providerInfo.background} alt={providerInfo.title} />
        <p className='bx--modal-content__text'>
          {providerInfo.desc.split('\n').map((item) => {
            return <span>{item}<br /></span>
          })}
        </p>
      </Modal>
    )
  }
}
