// @flow
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import DocumentTitle from 'react-document-title'
import { etherscanAddress, addressShortifier } from 'polymath-ui'
import {
  Button,
  DataTable,
  PaginationV2,
  Modal,
  DatePicker,
  DatePickerInput,
  Icon,
  ComposedModal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  InlineNotification,
  OverflowMenu,
  OverflowMenuItem,
} from 'carbon-components-react'
import type { Investor, Address, SecurityToken } from 'polymathjs/types'

import NotFoundPage from '../NotFoundPage'
import Progress from '../token/components/Progress'
import {
  importWhitelist,
  addInvestor,
  fetchWhitelist,
  listLength,
  removeInvestors,
  editInvestors,
  resetUploaded,
  PERMANENT_LOCKUP_TS,
  getFreezeStatus,
  toggleFreeze,
} from './actions'
import AddInvestorForm, { formName as addInvestorFormName } from './components/AddInvestorForm'
import EditInvestorsForm, { formName as editInvestorsFormName } from './components/EditInvestorsForm'
import ImportWhitelistModal from './components/ImportWhitelistModal'

import type { RootState } from '../../redux/reducer'
import type { InvestorCSVRow } from './actions'

import './style.css'

const {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableBatchActions,
  TableToolbarSearch,
  TableToolbarContent,
} = DataTable

type StateProps = {|
  investors: Array<Investor>,
  criticals: Array<InvestorCSVRow>,
  stateListLength: number,
  token: SecurityToken,
  isTokenFrozen: boolean,
|}

type DispatchProps = {|
  fetchWhitelist: () => any,
  listLength: number => any,
  addInvestor: () => any,
  importWhitelist: () => any,
  editInvestors: (investors: Array<Address>) => any,
  removeInvestors: (investors: Array<Address>) => any,
  reset: (formName: string) => any,
  resetUploaded: () => any,
  getFreezeStatus: () => any,
  toggleFreeze: (postToggle: ?Function) => any
|}

const mapStateToProps = (state: RootState) => ({
  investors: state.whitelist.investors,
  criticals: state.whitelist.criticals,
  stateListLength: state.whitelist.listLength,
  token: state.token.token,
  isTokenFrozen: state.whitelist.freezeStatus,
})

const mapDispatchToProps = {
  fetchWhitelist,
  listLength,
  addInvestor,
  importWhitelist,
  editInvestors,
  removeInvestors,
  resetUploaded,
  reset,
  getFreezeStatus,
  toggleFreeze,
}

type Props = StateProps & DispatchProps

type State = {|
  page: number,
  editInvestors: Array<Address>,
  isAddModalOpen: boolean,
  isEditModalOpen: boolean,
  isImportModalOpen: boolean,
  isImportConfirmModalOpen: boolean,
  startDateAdded: ?Date,
  endDateAdded: ?Date,
  isFreezeModalOpen: boolean,
  isFrozenModalOpen: boolean,
|}

const dateFormat = (date: Date): string => {
  if (date.getTime() === PERMANENT_LOCKUP_TS) {
    return 'Permanent'
  }
  return date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })
}

class CompliancePage extends Component<Props, State> {

  state = {
    page: 0,
    editInvestors: [],
    isAddModalOpen: false,
    isEditModalOpen: false,
    isImportModalOpen: false,
    isImportConfirmModalOpen: false,
    startDateAdded: null,
    endDateAdded: null,
    isFreezeModalOpen: false,
    isFrozenModalOpen: false,
  }

  componentWillMount () {
    this.props.fetchWhitelist()
    this.props.getFreezeStatus().then(()=>{
      if(this.props.isTokenFrozen){
        this.setState({ isFrozenModalOpen: true })
      }
    })
  }

  handleFreezeSubmit = () => {
    this.setState({ isFreezeModalOpen: true })
  }

  handleFreezeConfirm = () => {
    this.setState({ isFreezeModalOpen: false })
    this.props.toggleFreeze((()=>{
      this.setState({ isFrozenModalOpen: true })
    }))  
  }

  handleUnfreezeConfirm = () =>{
    this.setState({ isFrozenModalOpen: false })
    this.props.toggleFreeze() 
  }

  handleFreezeCancel = () => {
    this.setState({ isFreezeModalOpen: false })
  }

  handleChangePages = (pc) => {
    this.props.listLength(pc.pageSize)
    this.setState({
      page: pc.page - 1,
    })
  }

  handleDateAddedChange = (picker: [Date, Date]) => {
    this.setState({
      page: 0,
      startDateAdded: picker[0],
      endDateAdded: picker[1],
    })
  }

  handleAddModalOpen = () => {
    this.props.reset(addInvestorFormName)
    this.setState({ isAddModalOpen: true })
  }

  handleAddModalClose = () => {
    this.setState({ isAddModalOpen: false })
  }

  handleAddInvestorSubmit = () => {
    this.handleAddModalClose()
    this.props.addInvestor()
  }

  handleImportModalOpen = () => {
    this.props.resetUploaded()
    this.setState({ isImportModalOpen: true })
  }

  handleImportModalClose = () => {
    this.setState({ isImportModalOpen: false })
  }

  handleImportConfirmModalClose = () => {
    this.setState({ isImportConfirmModalOpen: false })
  }

  handleImportConfirm = () => {
    this.setState({ isImportConfirmModalOpen: true })
  }

  handleImport = () => {
    this.setState({ isImportConfirmModalOpen: false })
    this.props.importWhitelist()
  }

  handleBatchEdit = (selectedRows: Array<Object>) => {
    const addresses = []
    for (let i = 0; i < selectedRows.length; i++) {
      addresses.push(selectedRows[i].cells[0].value)
    }
    this.props.reset(editInvestorsFormName)
    this.setState({
      isEditModalOpen: true,
      editInvestors: addresses,
    })
  }

  handleEditSubmit = () => {
    this.props.editInvestors(this.state.editInvestors)
    this.setState({
      isEditModalOpen: false,
    })
  }

  handleEditModalClose = () => {
    this.setState({
      isEditModalOpen: false,
    })
  }

  handleBatchDelete = (selectedRows: Array<Object>) => {
    let addresses = []
    for (let i = 0; i < selectedRows.length; i++) {
      addresses.push(selectedRows[i].cells[0].value)
    }
    this.props.removeInvestors(addresses)
  }

  paginationRendering () {
    const { investors, stateListLength } = this.props
    const pageNum = this.state.page
    const startSlice = pageNum * stateListLength
    const endSlice = (pageNum + 1) * stateListLength
    const paginated = investors.slice(startSlice, endSlice)
    const stringified = []
    for (let investor of paginated) {
      // filter by date added
      if (
        // $FlowFixMe
        (this.state.startDateAdded && investor.added < this.state.startDateAdded) ||
        // $FlowFixMe
        (this.state.endDateAdded && investor.added > this.state.endDateAdded)
      ) {
        continue
      }
      stringified.push({
        id: investor.address,
        address: investor.address,
        added: investor.added ? dateFormat(investor.added) : null,
        addedBy: investor.addedBy,
        from: dateFormat(investor.from),
        to: dateFormat(investor.to),
        expiry: dateFormat(investor.expiry),
      })
    }
    return stringified
  }

  dataTableRender = ({
    rows,
    headers,
    getHeaderProps,
    getSelectionProps,
    getBatchActionProps,
    onInputChange,
    selectedRows,
  }) => (
    <TableContainer>
      <TableToolbar>
        <TableBatchActions {...getBatchActionProps()}>
          <Button
            icon='delete'
            iconDescription='Delete'
            onClick={() => this.handleBatchDelete(selectedRows)}
          >
            Delete
          </Button>
          <Button
            icon='edit'
            iconDescription='Edit Dates'
            onClick={() => this.handleBatchEdit(selectedRows)}
          >
            Edit Dates
          </Button>
        </TableBatchActions>
        <TableToolbarSearch onChange={onInputChange} />
        <TableToolbarContent>
          <Button
            icon='add--glyph'
            onClick={this.handleAddModalOpen}
            small
          >
            Add New
          </Button>
          <OverflowMenu floatingMenu flipped>
            <OverflowMenuItem itemText='Pause All Transfers' onClick={this.handleFreezeSubmit} />
          </OverflowMenu>
          <Modal
            className='whitelist-investor-modal'
            open={this.state.isAddModalOpen}
            onRequestClose={this.handleAddModalClose}
            modalHeading='Add New Investor'
            passiveModal
          >
            <p className='bx--modal-content__text'>
              Add individual addresses to the whitelist by inputting their ETH Address below.
            </p>
            <br />
            <AddInvestorForm onSubmit={this.handleAddInvestorSubmit} onClose={this.handleAddModalClose} />
          </Modal>
        </TableToolbarContent>

      </TableToolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableSelectAll {...getSelectionProps()} />
            {headers.map((header) => (
              <TableHeader {...getHeaderProps({ header })}>
                {header.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableSelectRow {...getSelectionProps({ row })} />
              {row.cells.map((cell, i) => (
                <TableCell key={cell.id}>
                  {i === 0 ? (
                    <div>{etherscanAddress(cell.value, cell.value)}</div>
                  ) : i === 2 ? (
                    <div>{etherscanAddress(cell.value, addressShortifier(cell.value))}</div>
                  ) : i === 6 ? (
                    <div>
                      <Icon
                        name='edit--glyph'
                        style={{ cursor: 'pointer' }}
                        fill='#889BAA'
                        width='24'
                        height='24'
                        description='Edit'
                        onClick={() => this.handleBatchEdit([row])}
                      />
                      &nbsp;
                      &nbsp;
                      <Icon
                        name='delete--glyph'
                        style={{ cursor: 'pointer' }}
                        fill='#889BAA'
                        width='24'
                        height='24'
                        description='Delete'
                        onClick={() => this.handleBatchDelete([row])}
                      />
                    </div>
                  ) : (
                    <div>{cell.value}</div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  render () {
    const { token, investors, criticals } = this.props
    if (!token || !token.address) {
      return <NotFoundPage />
    }
    const paginatedRows = this.paginationRendering()
    return (
      <DocumentTitle title='Compliance – Polymath'>
        <div>
          <Progress />
          <ComposedModal open={this.props.isTokenFrozen && this.state.isFrozenModalOpen} className='pui-confirm-modal'>
            <ModalHeader
              title={(
                <span>
                  <Icon name='icon--pause--outline' fill='#E71D32' width='24' height='24' />&nbsp;
                  All Transfers Paused
                </span>
              )}
            />
            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                All transfers have been paused, including on-chain secondary markets.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button onClick={this.handleUnfreezeConfirm} icon='icon--play'>RESUME TRANSFERS&nbsp;
              </Button>
            </ModalFooter>
          </ComposedModal>
          <ComposedModal open={this.state.isFreezeModalOpen} className='pui-confirm-modal'>
            <ModalHeader
              label='Confirmation required'
              title={(
                <span>
                  <Icon name='warning--glyph' fill='#E71D32' width='24' height='24' />&nbsp;
                  Pause All Transfers?
                </span>
              )}
            />
            <ModalBody>
              <div className='bx--modal-content__text'>
                <p>
                  Once you hit &laquo;CONFIRM&raquo;, the freeze on all transfers will PREVENT ANY INVESTOR FROM BUYING
                   OR SELLING YOUR TOKENS UNTIL YOU RESUME TRANSFERS. Consider notifying all your investors. If you wish
                    to review with your Advisors, please select &laquo;CANCEL&raquo;.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button kind='secondary' onClick={this.handleFreezeCancel}>
                CANCEL
              </Button>
              <Button onClick={this.handleFreezeConfirm}>CONFIRM</Button>
            </ModalFooter>
          </ComposedModal>

          <Button
            icon='upload'
            onClick={this.handleImportModalOpen}
            className='import-whitelist-btn'
          >
            Import Whitelist
          </Button>
          <ImportWhitelistModal
            isOpen={this.state.isImportModalOpen}
            onSubmit={this.handleImportConfirm}
            onClose={this.handleImportModalClose}
          />
          <ComposedModal
            open={this.state.isImportConfirmModalOpen}
            className='pui-confirm-modal whitelist-import-confirm-modal'
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
                  Please confirm that all previous information is correct and all investors are approved.
                  Once you hit &laquo;CONFIRM&raquo;, investors will be submitted to the blockchain.
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
                        </tr>
                      </thead>
                      <tbody>
                        {criticals.map(([id, address, sale, purchase, expiry]: InvestorCSVRow) => (
                          <tr key={id}>
                            <td>{id}</td>
                            <td>{addressShortifier(address)}</td>
                            <td>{sale}</td>
                            <td>{purchase}</td>
                            <td>{expiry}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : ''}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button kind='secondary' onClick={this.handleImportConfirmModalClose}>
                Cancel
              </Button>
              <Button onClick={this.handleImport}>Confirm</Button>
            </ModalFooter>
          </ComposedModal>

          <DatePicker
            onChange={this.handleDateAddedChange}
            datePickerType='range'
          >
            <DatePickerInput
              id='start-date-added'
              labelText='Start Date Added'
              placeholder='mm / dd / yyyy'
              onClick={() => {}}
              onChange={() => {}}
            />
            <DatePickerInput
              id='end-date-added'
              labelText='End Date Added'
              placeholder='mm / dd / yyyy'
              onClick={() => {}}
              onChange={() => {}}
            />
          </DatePicker>

          <DataTable
            rows={paginatedRows}
            headers={[
              { key: 'address', header: 'Investor\'s ETH address' },
              { key: 'added', header: 'Date added' },
              { key: 'addedBy', header: 'Added by' },
              { key: 'from', header: 'Sale lockup' },
              { key: 'to', header: 'Purchase lockup' },
              { key: 'expiry', header: 'KYC/AML Expiry' },
              { key: 'actions', header: '' },
            ]}
            render={this.dataTableRender}
          />
          <PaginationV2
            onChange={this.handleChangePages}
            pageSizes={[10, 20, 30, 40, 50]}
            totalItems={investors.length}
          />
          <Modal
            className='whitelist-investor-modal'
            open={this.state.isEditModalOpen}
            onRequestClose={this.handleEditModalClose}
            modalHeading='Edit Dates'
            passiveModal
          >
            <p className='bx--modal-content__text'>
              Please enter the information below to edit the chosen investors.
            </p>
            <br />
            <EditInvestorsForm onSubmit={this.handleEditSubmit} onClose={this.handleEditModalClose} />
          </Modal>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompliancePage)
