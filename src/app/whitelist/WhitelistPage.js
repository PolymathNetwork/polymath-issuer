// @flow
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import uuidv4 from 'uuid/v4'
import { addressShortifier, etherscanAddress } from 'polymath-ui'
import {
  DataTable,
  PaginationV2,
  Modal,
  ModalWrapper,
  DatePicker,
  DatePickerInput,
  FileUploaderButton,
} from 'carbon-components-react'

import type { Address, SecurityToken } from 'polymathjs/types'

import NotFoundPage from '../NotFoundPage'
import Progress from '../token/components/Progress'
import {
  initialize,
  uploadCSV,
  ac_csvUpload,
  multiUserSubmit,
  oneUserSubmit,
  getWhitelist,
  listLength,
  removeInvestor,
  editInvestors,
} from './actions'
import AddInvestorForm from './components/AddInvestorForm'
import EditInvestorsForm from './components/EditInvestorsForm'
import BasicDropZone from './components/ReactDropZone'

import type { WhitelistState } from './reducer'

import './style.css'

const tableStyle = {
  backgroundColor: 'white',
}

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
  TableBatchAction,
  TableBatchActions,
  TableToolbarSearch,
  TableToolbarContent,
} = DataTable

type StateProps = {|
  whitelist: WhitelistState,
  token: SecurityToken,
|}

type DispatchProps = {|
  initialize: () => any,
  handleUpload: () => any,
  multiSubmit: () => any,
  singleSubmit: () => any,
  getWhitelist: (?Date, ?Date) => any,
  updateListLength: number => any,
  removeInvestor: (investors: Array<Address>) => any,
  editInvestors: (investors: Array<Address>) => any,
  reset: () => any,
|}

const mapStateToProps = (state) => ({
  whitelist: state.whitelist,
  token: state.token.token,
})

const mapDispatchToProps = (dispatch: Function) => ({
  initialize: () => dispatch(initialize()),
  handleUpload: (file) => dispatch(uploadCSV(file)),
  multiSubmit: () => dispatch(multiUserSubmit()),
  singleSubmit: () => dispatch(oneUserSubmit()),
  getWhitelist: (calenderStart: Date, calenderEnd: Date) =>
    dispatch(getWhitelist(calenderStart, calenderEnd)),
  updateListLength: (pageNumber: number) => dispatch(listLength(pageNumber)),
  removeInvestor: (investors: Array<Address>) =>
    dispatch(removeInvestor(investors)),
  editInvestors: (investors: Array<Address>) =>
    dispatch(editInvestors(investors)),
  reset: () => dispatch(ac_csvUpload([], [], [], false)),
})

type Props = StateProps & DispatchProps;

type State = {|
  page: number,
  editInvestorsShowing: boolean,
  editInvestors: Array<Address>,
|}

type EventData = {|
  id: string,
  address: Address,
  added: ?string,
  addedBy: ?Address,
  from: string,
  to: string,
|}

type PageChanger = {|
  page: number,
  pageSize: number,
|}

type DatePickerType = [Date, Date]

const dateFormat = (date: Date) =>
  date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const tableHeaders = [
  { key: 'address', header: 'Investor\'s ETH Address' },
  { key: 'added', header: 'Date Added' },
  { key: 'addedBy', header: 'Added By' },
  { key: 'from', header: 'Sell Restriction Until' },
  { key: 'to', header: 'Buy Restriction Until' },
]

class WhitelistPage extends Component<Props, State> {
  state = {
    page: 0,
    editInvestorsShowing: false,
    editInvestors: [],
  }

  componentWillMount () {
    this.props.initialize()
  }

  handleChangePages = (pc: PageChanger) => {
    this.props.updateListLength(pc.pageSize)
    this.setState({
      page: pc.page - 1,
    })
  }

  handleDatePicker = (picker: DatePickerType) => {
    if (picker.length === 2) {
      this.setState({
        page: 0, // TODO @davekaj: make sure that resetting to initial page is truly needed
      })
      this.props.getWhitelist(picker[0], picker[1])
    }
  }

  handleEditInvestors = (dataTableRow: Array<Object>) => {
    const addresses = []
    for (let i = 0; i < dataTableRow.length; i++) {
      addresses.push(dataTableRow[i].cells[0].value)
    }
    this.setState({
      editInvestorsShowing: true,
      editInvestors: addresses,
    })
  }

  handleRequestSubmit = () => {
    this.props.editInvestors(this.state.editInvestors)
    this.setState({
      editInvestorsShowing: false,
    })
  }

  handleRequestClose = () => {
    this.setState({
      editInvestorsShowing: false,
    })
  }

  // This is used to display the garbage cans in the table
  checkGarbageCell = (index) => {
    if (index === 4) return true
  }

  // This is used to add etherscan links on the addressed in the table
  checkAddressCell = (index) => {
    if (index === 0 || index === 2) return true
  }

  // renders the list by making it date strings and splitting up in pages, at the start of the render function
  paginationRendering () {
    const investors = this.props.whitelist.investors
    const pageNum = this.state.page
    const listLength = this.props.whitelist.listLength
    const startSlice = pageNum * listLength
    const endSlice = (pageNum + 1) * listLength
    let paginatedArray = investors.slice(startSlice, endSlice)
    const stringifiedArray = []
    for (let i = 0; i < paginatedArray.length; i++) {
      const csvRandomID: string = uuidv4()
      let stringifyAdded = null
      if (paginatedArray[i].added) {
        stringifyAdded = dateFormat(paginatedArray[i].added)
      }
      const stringifyFrom = dateFormat(paginatedArray[i].from)
      const stringifyTo = dateFormat(paginatedArray[i].to)
      const stringifyInvestor: EventData = {
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

  removeInvestorDataTable = (dataTableRow: Array<Object>) => {
    let addresses = []
    for (let i = 0; i < dataTableRow.length; i++) {
      addresses.push(dataTableRow[i].cells[0].value)
    }
    this.props.removeInvestor(addresses)
  }

  onHandleInvestorSubmit = () => {
    this.props.singleSubmit()
    return true // Must return true, for the component from carbon to work
  }

  onHandleMultiSubmit = () => {
    this.props.multiSubmit()
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
          <TableBatchAction
            onClick={() => this.removeInvestorDataTable(selectedRows)}
          >
            Remove Investor
          </TableBatchAction>
          <TableBatchAction
            onClick={() => this.handleEditInvestors(selectedRows)}
          >
            Edit Sale/Purchase Lockup Dates
          </TableBatchAction>
        </TableBatchActions>
        <TableToolbarSearch onChange={onInputChange} />
        <TableToolbarContent>
          <ModalWrapper
            id='transactional-modal'
            buttonTriggerText='Add New'
            modalHeading='Add New Investor'
            handleSubmit={this.onHandleInvestorSubmit}
            shouldCloseAfterSubmit
            primaryButtonText='Add New Investor'
          >
            <p className='bx--modal-content__text'>
              Add individual addresses to the whitelist by inputting their ETH Address below.
            </p>
            <br />
            <AddInvestorForm />
          </ModalWrapper>
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
          {rows.map((row, rowIndex) => (
            <TableRow key={row.id} style={tableStyle}>
              <TableSelectRow {...getSelectionProps({ row })} />
              {row.cells.map((cell, i) => (
                <TableCell key={cell.id}>
                  {this.checkGarbageCell(i) ? (
                    <div className='garbageFlexBox'>
                      {cell.value}
                      <div className='garbage'>
                        <svg
                          className='garbageCan'
                          width='16'
                          height='24'
                          viewBox='0 0 16 24'
                          fillRule='evenodd'
                          onClick={() =>
                            this.props.removeInvestor([
                              this.props.whitelist.investors[rowIndex].address,
                            ])
                          }
                        >
                          <path d='M4 0h8v2H4zM0 3v4h1v17h14V7h1V3H0zm13 18H3V8h10v13z' />
                          <path d='M5 10h2v9H5zm4 0h2v9H9z' />
                        </svg>
                      </div>
                    </div>
                  ) : this.checkAddressCell(i) ? (
                    <div>{etherscanAddress(cell.value, cell.value)}</div>
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
          <h1 className='pui-h1'>Whitelist</h1>
          <div className='bx--row'>
            <div className='bx--col-xs-6'>
              <ModalWrapper
                buttonTriggerText='Import Whitelist'
                modalLabel=''
                modalHeading='Import Whitelist'
                handleSubmit={this.onHandleMultiSubmit}
                primaryButtonText='Add Investors'
                shouldCloseAfterSubmit
              >
                <div
                  className={this.props.whitelist.previewCSVShowing ? '' : ''}
                >
                  <div>
                    <p className='csvModalText'>
                      Add multiple addresses to the whitelist by uploading a
                      comma separated CSV file. The format should be as follows:
                    </p>
                    <p className='csvModalText'>Column 1 &ndash; Ethereum Address.</p>
                    <p className='csvModalText'>
                      Column 2 &ndash; Sell Restriction Date mm / dd / yyyy
                      (date when the resale restrictions should be lifted for that address).
                    </p>
                    <p className='csvModalText'>
                      Column 3 &ndash; Buy Restriction Date mm / dd / yyyy
                      (date when the buy restrictions should be lifted for that address).
                    </p>
                    <p className='csvModalTextMini' style={{ display: 'none' }}>
                      You can download a <a href='/whitelist-sample.csv' download>Sample.csv</a> file and edit it
                    </p>
                    <div
                      data-notification
                      className='bx--inline-notification bx--inline-notification--error'
                      role='alert'
                    >
                      <div className='bx--inline-notification__details'>
                        <h3 className='bx--inline-notification__title'>
                          REMINDER:
                        </h3>
                        <p className='bx--inline-notification__subtitle'>
                          Investors must be approved before they are added to
                          the whitelist.
                        </p>
                      </div>
                    </div>
                  </div>
                  {this.props.whitelist.previewCSVShowing ? (
                    <div className='csvModalTableContainer'>
                      <table>
                        <tbody>
                          <tr className='csvPreviewHeader'>
                            <th>Investor&apos;s ETH Address</th>
                            <th>Sale Lockup End Date</th>
                            <th>Purchase Lockup End Date</th>
                          </tr>
                          {this.props.whitelist.addresses.map((user, i) => (
                            <tr key={uuidv4()} className='csvPreviewTable'>
                              <td className='csvTableEthAddress'>
                                {addressShortifier(
                                  this.props.whitelist.addresses[i]
                                )}
                              </td>
                              <td>{this.props.whitelist.sell[i]}</td>
                              <td>{this.props.whitelist.buy[i]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : ''}
                  <div>
                    <BasicDropZone onHandleUpload={this.props.handleUpload} />
                    <FileUploaderButton
                      labelText='Upload From Desktop'
                      onChange={this.props.handleUpload}
                      accept={['.csv']}
                      multiple
                      buttonKind='secondary'
                    />
                  </div>
                </div>
              </ModalWrapper>
              <br />
            </div>
          </div>
          <div className='bx--row'>
            <div className='bx--col-xs-4'>
              <DatePicker
                onChange={this.handleDatePicker}
                datePickerType='range'
              >
                <DatePickerInput
                  labelText='Start Date Added'
                  placeholder='mm / dd / yyyy'
                />
                <DatePickerInput
                  labelText='End Date Added'
                  placeholder='mm / dd / yyyy'
                />
              </DatePicker>
            </div>
          </div>
          <DataTable
            rows={paginatedRows}
            headers={tableHeaders}
            render={this.dataTableRender}
          />
          <PaginationV2
            onChange={this.handleChangePages}
            pageSizes={[10, 20, 30, 40, 50]}
            totalItems={this.props.whitelist.investors.length}
          />
          {this.state.editInvestorsShowing ? (
            <Modal
              onRequestSubmit={this.handleRequestSubmit}
              onRequestClose={this.handleRequestClose}
              open
              modalHeading='Edit Existing Investors'
              primaryButtonText='Send'
              secondaryButtonText='Cancel'
            >
              <p className='bx--modal-content__text'>
                Please enter the information below to edit the chosen investors.
              </p>
              <br />
              <EditInvestorsForm />
            </Modal>
          ) : null}
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WhitelistPage)
