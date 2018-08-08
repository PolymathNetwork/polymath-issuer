// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Icon, FileUploader, Button, InlineNotification } from 'carbon-components-react'
import { Remark } from 'polymath-ui'

import { uploadCSV } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  isTooMany: boolean,
  isReady: boolean,
  isInvalid: boolean,
  isPercentageDisabled: boolean,
|}

type DispatchProps = {|
  uploadCSV: (file: Object) => any,
|}

type Props = {|
  isOpen: boolean,
  onClose: () => any,
  onSubmit: (file: ?Object) => any,
|} & StateProps & DispatchProps

const mapStateToProps = (state: RootState) => ({
  isTooMany: state.whitelist.isTooMany,
  isReady: state.whitelist.uploaded.length > 0,
  isInvalid: state.whitelist.criticals.length > 0,
  isPercentageDisabled: state.whitelist.percentageTM.isPaused,
})

const mapDispatchToProps = {
  uploadCSV,
}

class ImportWhitelistModal extends Component<Props> {

  constructor (props) {
    super(props) // $FloFixMe
  }

  handleClose = () => {
    // TODO @bshevchenko: maybe there is a better way to reset FileUploader $FlowFixMe
    const node = this.fileUploader.nodes[0]
    if (node) {
      const el = Array.from(node.getElementsByClassName('bx--file-close'))[0]
      const event = document.createEvent('Events')
      event.initEvent('click', true, false)
      el.dispatchEvent(event)
    }
    this.props.onClose()
  }

  handleSubmit = () => {
    this.handleClose()
    this.props.onSubmit()
  }

  handleUploaded = (event) => { // eslint-disable-next-line no-console
    console.log('HANDLE UPLOADED') // eslint-disable-next-line no-console
    console.log('handleUploaded event', event) // eslint-disable-next-line no-console
    console.log('handleUploaded event.target', event.target) // eslint-disable-next-line no-console
    console.log('handleUploaded event.target.files', event.target.files) // eslint-disable-next-line no-console
    console.log('handleUploaded event.target.files[0]', event.target.files[0]) // eslint-disable-next-line no-console
    // eslint-disable-next-line
    const file = event.target.files[0] // eslint-disable-next-line no-console
    console.log('handleUploaded file.type', file.type) // eslint-disable-next-line no-console
    console.log('handleUploaded file.type.match', file.type.match(/csv.*/))
    if (file.type.match(/csv.*/)) { // eslint-disable-next-line no-console
      console.log('handleUploaded matched file', file)
      this.props.uploadCSV(file)
    }
  }

  fileUploaderRef = (el: ?Object) => { // $FlowFixMe
    this.fileUploader = el
  }

  render () {
    const { isOpen, isTooMany, isReady, isInvalid, isPercentageDisabled } = this.props
    return (
      <Modal
        open={isOpen}
        onRequestClose={this.handleClose}
        modalHeading='Import Whitelist'
        passiveModal
        className='whitelist-import-modal'
      >
        <h4 className='pui-h4'>
          Add multiple addresses to the whitelist by uploading a comma separated .CSV file.
          The format should be as follows:<br />
          — ETH Address (address to whitelist);<br />
          — Sell Restriction Date mm/dd/yyyy (date when the resale restrictions should be lifted for that address);
          <br />
          Empty cell will be considered as permanent lockup.
          <br />
          — Buy Restriction Date mm/dd/yyyy (date when the buy restrictions should be lifted for that address);<br />
          — KYC/AML Expiry Date mm/dd/yyyy;<br />
          — Can buy from STO: <strong>true</strong> to enable OR empty cell to disable;<br />
          {!isPercentageDisabled ?
            <span>
              — Exempt From % Ownership: <strong>true</strong> to enable OR empty cell to disable;<br />
            </span>
            : ''}
          Maximum numbers of investors per transaction is <strong>75</strong>.
        </h4>
        <h5 className='pui-h5'>
          You can&nbsp;&nbsp;&nbsp;
          <Icon name='download' fill='#252D6B' width='16' height='16' />&nbsp;
          <a href='/whitelist-sample.csv' className='pui-bold' download>Download Sample.csv</a>
          &nbsp;&nbsp;file and edit it.
        </h5>
        <FileUploader
          iconDescription='Cancel'
          buttonLabel='Upload File'
          onChange={this.handleUploaded}
          className='file-uploader'
          accept={['.csv']}
          buttonKind='secondary'
          filenameStatus='edit'
          ref={this.fileUploaderRef}
        />
        {isInvalid && !isReady ? (
          <InlineNotification
            hideCloseButton
            title='The file you uploaded does not contain any valid values'
            subtitle='Please check instructions above and try again.'
            kind='error'
          />
        ) : isTooMany ? (
          <InlineNotification
            hideCloseButton
            title='The file you uploaded contains more than 75 investors'
            subtitle='You can still continue, but only 75 first investors will be submitted.'
            kind='error'
          />
        ) : (
          <div>
            <br />
            <Remark title='Reminder'>
              Investors must be approved before they are added to the whitelist.
            </Remark>
          </div>
        )}
        <p align='right'>
          <Button kind='secondary' onClick={this.handleClose}>
            Cancel
          </Button>
          <Button type='submit' disabled={!isReady} onClick={this.handleSubmit}>
            Import Whitelist
          </Button>
        </p>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportWhitelistModal)
