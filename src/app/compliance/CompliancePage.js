// @flow
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import DocumentTitle from 'react-document-title'
import uuidv4 from 'uuid/v4'
import { etherscanAddress } from 'polymath-ui'
import {
  Button,
  DataTable,
  PaginationV2,
  Modal,
  DatePicker,
  DatePickerInput,
  Icon,
} from 'carbon-components-react'

import type { Address, SecurityToken } from 'polymathjs/types'

import NotFoundPage from '../NotFoundPage'
import Progress from '../token/components/Progress'
import {
  multiUserSubmit,
  addInvestor,
  fetchWhitelist,
  listLength,
  removeInvestors,
  editInvestors,
  PERMANENT_LOCKUP_TS,
} from './actions'
import AddInvestorForm, { formName as addInvestorFormName } from './components/AddInvestorForm'
import EditInvestorsForm, { formName as editInvestorsFormName } from './components/EditInvestorsForm'

import type { WhitelistState } from './reducer'

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
  whitelist: WhitelistState,
  token: SecurityToken,
|}

type DispatchProps = {|
  fetchWhitelist: () => any,
  listLength: number => any,
  addInvestor: () => any,
  multiUserSubmit: () => any,
  editInvestors: (investors: Array<Address>) => any,
  removeInvestors: (investors: Array<Address>) => any,
  reset: (formName: string) => any,
|}

const mapStateToProps = (state) => ({
  whitelist: state.whitelist,
  token: state.token.token,
})

const mapDispatchToProps = {
  fetchWhitelist,
  listLength,
  addInvestor,
  multiUserSubmit,
  editInvestors,
  removeInvestors,
  reset,
}

type Props = StateProps & DispatchProps

type State = {|
  page: number,
  editInvestors: Array<Address>,
  isAddModalOpen: boolean,
  isEditModalOpen: boolean,
  // isImportModalOpen: boolean,
  startDateAdded: ?Date,
  endDateAdded: ?Date,
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
    // isImportModalOpen: false,
    startDateAdded: null,
    endDateAdded: null,
  }

  componentWillMount () {
    this.props.fetchWhitelist()
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

  handleImportModalOpen = () => {
    // this.setState({ isImportModalOpen: true })
  }

  handleImportModalClose = () => {
    // this.setState({ isImportModalOpen: false })
  }

  handleBatchDelete = (selectedRows: Array<Object>) => {
    let addresses = []
    for (let i = 0; i < selectedRows.length; i++) {
      addresses.push(selectedRows[i].cells[0].value)
    }
    this.props.removeInvestors(addresses)
  }

  // renders the list by making it date strings and splitting up in pages, at the start of the render function
  paginationRendering () {
    const { investors, listLength } = this.props.whitelist
    const pageNum = this.state.page
    const startSlice = pageNum * listLength
    const endSlice = (pageNum + 1) * listLength
    const paginatedArray = investors.slice(startSlice, endSlice)
    const stringifiedArray = []
    for (let i = 0; i < paginatedArray.length; i++) {
      if (
        // $FlowFixMe
        (this.state.startDateAdded && paginatedArray[i].added < this.state.startDateAdded) ||
        // $FlowFixMe
        (this.state.endDateAdded && paginatedArray[i].added > this.state.endDateAdded)
      ) {
        continue
      }
      const csvRandomID: string = uuidv4()
      let stringifyAdded = null
      if (paginatedArray[i].added) {
        stringifyAdded = dateFormat(paginatedArray[i].added)
      }
      const stringifyFrom = dateFormat(paginatedArray[i].from)
      const stringifyTo = dateFormat(paginatedArray[i].to)
      const stringifyInvestor = {
        id: csvRandomID,
        address: paginatedArray[i].address,
        added: stringifyAdded,
        addedBy: paginatedArray[i].addedBy,
        from: stringifyFrom,
        to: stringifyTo,
      }
      stringifiedArray.push(stringifyInvestor)
    }
    return stringifiedArray
  }

  onHandleMultiSubmit = () => {
    this.props.multiUserSubmit()
    return true // Must return true, for the component from carbon to work
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
            icon='delete--glyph'
            iconDescription='Delete'
            onClick={() => this.handleBatchDelete(selectedRows)}
          >
            Delete
          </Button>
          <Button
            icon='edit--glyph'
            iconDescription='Edit Lockup Dates'
            onClick={() => this.handleBatchEdit(selectedRows)}
          >
            Edit Lockup Dates
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
                  {(i === 0 || i === 2) ? (
                    <div>{etherscanAddress(cell.value, cell.value)}</div>
                  ) : i === 5 ? (
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
    const { token } = this.props
    if (!token || !token.address) {
      return <NotFoundPage />
    }
    const paginatedRows = this.paginationRendering()
    return (
      <DocumentTitle title='Whitelist – Polymath'>
        <div>
          <Progress />

          <Button
            icon='upload'
            onClick={this.handleImportModalOpen}
            className='import-whitelist-btn'
          >
            Import Whitelist
          </Button>

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
              { key: 'actions', header: '' },
            ]}
            render={this.dataTableRender}
          />
          <PaginationV2
            onChange={this.handleChangePages}
            pageSizes={[10, 20, 30, 40, 50]}
            totalItems={this.props.whitelist.investors.length}
          />
          <Modal
            className='whitelist-investor-modal'
            open={this.state.isEditModalOpen}
            onRequestClose={this.handleEditModalClose}
            modalHeading='Edit Lockup Dates'
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
