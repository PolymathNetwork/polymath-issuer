// @flow

/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import uuidv4 from 'uuid/v4'
import {
  DataTable,
  PaginationV2,
  Modal,
  ModalWrapper,
  DatePicker,
  DatePickerInput,
  // FileUploaderButton,
  Button,
} from 'carbon-components-react'

import type { Address, SecurityToken } from 'polymathjs/types'

import Progress from '../../token/components/Progress'
import {
  initialize,
  uploadCSV,
  multiUserSubmit,
  oneUserSubmit,
  getWhitelist,
  listLength,
  removeInvestor,
  editInvestors,
} from './actions'
import InvestorForm from './components/addInvestorForm'
import EditInvestorsForm from './components/editInvestorsForm'
import BasicDropzone from './components/ReactDropZone'

import type { WhitelistState } from './reducer'

import './style.css'

const tableStyle = {
  'backgroundColor': 'white',
}

const { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow,
  TableSelectAll, TableSelectRow, TableToolbar, TableBatchAction, TableBatchActions,
  TableToolbarSearch, TableToolbarContent } = DataTable

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
  updateListLength: (number) => any,
  removeInvestor: (investors: Array<Address>) => any,
  editInvestors: (investors: Array<Address>) => any,
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
  getWhitelist: (calenderStart: Date, calenderEnd: Date) => dispatch(getWhitelist(calenderStart, calenderEnd)),
  updateListLength: (pageNumber: number) => dispatch(listLength(pageNumber)),
  removeInvestor: (investors: Array<Address>) => dispatch(removeInvestor(investors)),
  editInvestors: (investors: Array<Address>) => dispatch(editInvestors(investors)),
})

type Props = StateProps & DispatchProps

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

const dateFormat = (date: Date) => date.toLocaleDateString('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const tableHeaders = [
  { key: 'address', header: 'Investor Eth Address' },
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
      page: (pc.page - 1),
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
    let addresses = []
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

  onHandleInvestorSubmit = () => {
    this.props.singleSubmit()
    return true  // Must return true, for the component from carbon to work
  }

  //This is used to display the garbage cans in the table
  checkEqualFour = (index) => {
    if (index === 4) return true
  }

  //renders the list by making it date strings and splitting up in pages, at the start of the render function
  paginationRendering () {
    let paginatedArray = []
    let investors = this.props.whitelist.investors
    let pageNum = this.state.page
    let listLength = this.props.whitelist.listLength
    let startSlice = pageNum * listLength
    let endSlice = ((pageNum+1) * listLength)
    paginatedArray = investors.slice(startSlice, endSlice)
    let stringifiedArray = []
    for (let i = 0; i <paginatedArray.length; i++){
      let csvRandomID: string = uuidv4()
      let stringifyAdded = null
      if (paginatedArray[i].added) {
        stringifyAdded = dateFormat(paginatedArray[i].added)
      }
      let stringifyFrom = dateFormat(paginatedArray[i].from)
      let stringifyTo = dateFormat(paginatedArray[i].to)
      let stringifyInvestor: EventData = {
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
          <TableBatchAction onClick={()=> this.removeInvestorDataTable(selectedRows)}>
              Remove Investor
          </TableBatchAction>
          <TableBatchAction onClick={()=> this.handleEditInvestors(selectedRows)}>
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
            primaryButtonText='Send To Blockchain'

          >
            <p className='bx--modal-content__text'>
                Please enter the information below to add a single investor.
            </p>
            <br />
            <InvestorForm />
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
                  {this.checkEqualFour(i) ?
                    <div className='garbageFlexBox'>
                      {cell.value}
                      <svg width='16' height='24' viewBox='0 0 16 24' fillRule='evenodd' onClick={()=> this.props.removeInvestor([this.props.whitelist.investors[rowIndex].address])}>
                        <path d='M4 0h8v2H4zM0 3v4h1v17h14V7h1V3H0zm13 18H3V8h10v13z' />
                        <path d='M5 10h2v9H5zm4 0h2v9H9z' />
                      </svg>
                    </div>
                    :
                    <div>
                      {cell.value}
                    </div>
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  render () {
    let paginatedRows =  this.paginationRendering()
    return (
      <DocumentTitle title='Whitelist – Polymath'>
        <div>
          <Progress current={4} />
          <div className='bx--row'>
            <div className='bx--col-xs-6'>
              <ModalWrapper
                id='input-modal'
                buttonTriggerText='Import Whitelist'
                modalLabel=''
                modalHeading='Import Whitelist'
                handleSubmit={this.onHandleMultiSubmit}
                primaryButtonText='Send To Blockchain'
                shouldCloseAfterSubmit
              >
                <div className={this.props.whitelist.previewCSVShowing ? 'modalSize' : ''}>
                  <div className='csvModal'>
                    <p className='csvModalText'>Add multiple addresses to the whitelist by uploading a comma seperated CSV file. The format should be as follows:</p>
                    <p className='csvModalText'>Column 1 - Ethereum Address</p>
                    <p className='csvModalText'>Column 2 - Date mm/dd/yyyy (date when the resale restrictions should be lifted for that address).</p>
                    <p className='csvModalTextMini'>You can download a <a href='localhost:3000'>Sample.csv</a> file and edit it</p>
                  </div>
                  <br />
                  {this.props.whitelist.previewCSVShowing ? null :
                    (
                      <div>
                        <BasicDropzone onHandleUpload={this.props.handleUpload} />
                        {/* TODO @davekaj: this button is not displaying correctly for Boris, and maybe others. Dave to talk to stan about new designs
                          <FileUploaderButton
                          labelText='Upload From Desktop'
                          className='bob'
                          onChange={this.props.handleUpload}
                          accept={['.csv']}
                          multiple
                          buttonKind='secondary'
                        /> */}
                      </div>
                    )}
                  {this.props.whitelist.previewCSVShowing ? (
                    <div className='csvModalTable'>
                      {/* <div>{this.props.whitelist.csvMessage}</div> TODO @davekaj: Reword this section so it works with the design */}
                      {/* Below is the data you will be sending to the blockchain, please confirm it is correct, and then click the Send button to continue. */}
                      <br />
                      <table>
                        <tbody>
                          <tr className='csvPreviewHeader'>
                            <th>Investor&apos;s Eth Address</th>
                            <th>Sale Lockup End Date</th>
                            <th>Purchase Lockup End Date</th>
                          </tr>
                          {this.props.whitelist.addresses.map((user, i) => (
                            <tr key={uuidv4()} className='csvPreviewTable'>
                              <td>{this.props.whitelist.addresses[i]}</td>
                              <td className='csvModalTableDates' >{this.props.whitelist.sell[i]}</td>
                              <td className='csvModalTableDates'>{this.props.whitelist.buy[i]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                    : null}
                </div>
              </ModalWrapper>
              <br />
            </div>
          </div>
          <div className='bx--row'>
            <div className='bx--col-xs-2'>
              <DatePicker id='date-picker' onChange={this.handleDatePicker} datePickerType='range'>
                <DatePickerInput
                  className='some-class'
                  labelText='Start Date Added'
                  placeholder='mm/dd/yyyy'
                  id='date-picker-input-id'
                  onClick={()=>{}} // include this to get rid of error being passed onto the component and shown in console
                />
                <DatePickerInput
                  className='some-class'
                  labelText='End Date Added'
                  placeholder='mm/dd/yyyy'
                  id='date-picker-input-id-2'
                  onClick={()=>{}} // include this to get rid of error being passed onto the component and shown in console
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
              className='some-class'
              open
              modalHeading='Edit Exisiting Investors'
              primaryButtonText='Send'
              secondaryButtonText='Cancle'
            >
              <p className='bx--modal-content__text'>
                Please enter the information below to edit the chosen investors.
              </p>
              <br />
              <EditInvestorsForm />
            </Modal>
          )
            : null}

          {!this.props.token.status ? (
            <Modal
              open
              passiveModal
              modalHeading='Complete The STO Section'
              primaryButtonText='Go to STO Section'
            >
              <p className='bx--modal-content__text'>
                  Please confirm that you are ready to proceed to the next step in the STO process
              </p>
              <Button href={`/dashboard/${this.props.token.ticker}/sto`}>
                Go to STO Section
              </Button>
            </Modal>
          )
            : null}
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WhitelistPage)
