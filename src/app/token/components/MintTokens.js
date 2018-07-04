// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Remark, addressShortifier } from 'polymath-ui'
import {
  Icon,
  FileUploader,
  InlineNotification,
  Button,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'carbon-components-react'

import { uploadCSV, mintTokens, mintResetUploaded } from '../actions'
import type { RootState } from '../../../redux/reducer'
import type { InvestorCSVRow } from '../actions'

type StateProps = {|
  isTooMany: boolean,
  isReady: boolean,
  isInvalid: boolean,
  criticals: Array<InvestorCSVRow>,
|}

type DispatchProps = {|
  uploadCSV: (file: Object) => any,
  mintTokens: () => any,
  mintResetUploaded: () => any,
|}

type State = {|
  isConfirmModalOpen: boolean,
|}

const mapStateToProps = (state: RootState): StateProps => ({
  isTooMany: state.token.mint.isTooMany,
  isReady: state.token.mint.uploaded.length > 0,
  isInvalid: state.token.mint.criticals.length > 0,
  criticals: state.token.mint.criticals,
})

const mapDispatchToProps = {
  uploadCSV,
  mintTokens,
  mintResetUploaded,
}

type Props = {|
|} & StateProps & DispatchProps

class MintTokens extends Component<Props, State> {

  state = {
    isConfirmModalOpen: false,
  }

  handleReset = (withState = true) => {
    // TODO @bshevchenko: maybe there is a better way to reset FileUploader $FlowFixMe
    const node = this.fileUploader.nodes[0]
    if (node) {
      const el = Array.from(node.getElementsByClassName('bx--file-close'))[0]
      const event = document.createEvent('Events')
      event.initEvent('click', true, false)
      el.dispatchEvent(event)
      if (withState) {
        this.props.mintResetUploaded()
      }
    }
  }

  handleClick = (event: Object) => {
    const el = event.target
    if (el.getAttribute('class') === 'bx--file-close' ||
      // TODO @bshevchenko: maybe there is a better way to handle cancel event
      (el.getAttribute('d') && el.getAttribute('d').substring(0, 6) === 'M8 0C3')) {
      this.props.mintResetUploaded()
    }
  }

  handleConfirmModalOpen = () => {
    this.setState({ isConfirmModalOpen: true })
  }

  handleConfirmModalClose = () => {
    this.setState({ isConfirmModalOpen: false })
    this.handleReset()
  }

  handleUploaded = (file: Object) => {
    // eslint-disable-next-line
    file = file.target.files[0]
    if (file.type.match(/csv.*/)) {
      this.props.uploadCSV(file)
    }
  }

  handleSubmit = () => {
    this.setState({ isConfirmModalOpen: false })
    this.props.mintTokens()
    this.handleReset(false)
  }

  fileUploaderRef = (el: ?Object) => { // $FlowFixMe
    this.fileUploader = el
  }

  render () {
    const { isTooMany, isReady, isInvalid, criticals } = this.props

    return (
      <div className='bx--col-xs-7'>
        <div className='pui-page-box'>
          <Remark title='Note'>
            This action will trigger multiple signing operations with your MetaMask wallet:<br />
            — One for the initial whitelist upload;<br />
            — One for the minting of tokens.
          </Remark>
          <h2 className='pui-h2'>
            Mint Your Tokens
          </h2>
          <h3 className='pui-h3'>
            Your Security Token is now deployed to the blockchain.<br />
            Let’s mint token for your reserve and your current shareholders.
          </h3>
          <br />
          <h4 className='pui-h4'>
            Before you proceed, please check with your Advisor how your tokens should be distributed.
            Also, note that the ETH Addresses to which tokens are minted will be automatically added
            to the whitelist to allow for the tokens to be transferred.
          </h4>
          <h4 className='pui-h4'>
            Enter the addresses and token quantities that need to be
            minted by uploading a comma separated .CSV file.
          </h4>
          <h4 className='pui-h4'>
            The format of the file should be as follow:<br />
            — ETH Address (address to whitelist);<br />
            — Sell Restriction Date mm/dd/yyyy (date when the resale restrictions
            should be lifted for that address);
            <br />
            — Buy Restriction Date mm/dd/yyyy (date when the buy restrictions should be
            lifted for that address);<br />
            Empty cell will be considered as permanent lockup.<br />
            — KYC/AML Expiry Date mm/dd/yyyy;<br />
            – Number of tokens to mint for the ETH address (integer).<br />
            Maximum numbers of addresses per transaction is <strong>75</strong>.
          </h4>
          <h5 className='pui-h5'>
            You can&nbsp;&nbsp;&nbsp;
            <Icon name='download' fill='#252D6B' width='16' height='16' />&nbsp;
            <a href='/mint-sample.csv' className='pui-bold' download>Download Sample.csv</a>
            &nbsp;&nbsp;file and edit it.
          </h5>
          <FileUploader
            iconDescription='Cancel'
            buttonLabel='Upload File'
            onChange={this.handleUploaded}
            onClick={this.handleClick}
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
              title='The file you uploaded contains more than 75 addresses'
              subtitle='You can still continue, but only 75 first addresses will be submitted.'
              kind='error'
            />
          ) : ''}
          <Button type='submit' disabled={!isReady} onClick={this.handleConfirmModalOpen} style={{ marginTop: '10px' }}>
            Mint Tokens
          </Button>

          <ComposedModal
            open={this.state.isConfirmModalOpen}
            className='pui-confirm-modal mint-confirm-modal'
          >
            <ModalHeader
              label='Confirmation required'
              title={(
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                  Before You Proceed
                </span>
              )}
            />
            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  Please confirm that all previous information is correct.
                  Once you hit &laquo;CONFIRM&raquo;, data will be submitted to the blockchain.
                  Any change will require that you start the process over. If you wish to review your information,
                  please select &laquo;CANCEL&raquo;.
                </p>
                {criticals.length ? (
                  <div>
                    <InlineNotification
                      hideCloseButton
                      title={criticals.length + ' Error' + (criticals.length > 1 ? 's' : '') + ' in Your .csv File'}
                      subtitle={'Please note that the entries below contains error that prevent their content to be ' +
                      'committed to the blockchain. Entries were automatically deselected so they are not submitted ' +
                      'to the blockchain. You can also elect to cancel the operation to review the csv file offline.'}
                      kind='error'
                    />
                    <table className='import-criticals'>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Address</th>
                          <th>Sale Lockup</th>
                          <th>Purchase Lockup</th>
                          <th>KYC/AML Expiry</th>
                          <th>Tokens</th>
                        </tr>
                      </thead>
                      <tbody>
                        {criticals.map(([id, address, sale, purchase, expiry, tokens]: InvestorCSVRow) => (
                          <tr key={id}>
                            <td>{id}</td>
                            <td>{addressShortifier(address)}</td>
                            <td>{sale}</td>
                            <td>{purchase}</td>
                            <td>{expiry}</td>
                            <td>{tokens}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : ''}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button kind='secondary' onClick={this.handleConfirmModalClose}>
                Cancel
              </Button>
              <Button onClick={this.handleSubmit}>Confirm</Button>
            </ModalFooter>
          </ComposedModal>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MintTokens)
