// @flow

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
  FileUploaderButton,
} from 'carbon-components-react'
import { TransferManager } from 'polymathjs'

import type { Investor } from 'polymathjs/types'

import { initialize, uploadCSV, multiUserSubmit, oneUserSubmit, getWhitelist, listLength, removeInvestor, editInvestors } from './actions'
import { TableHeaders } from './tableHeaders'
import InvestorForm from './components/userForm'
import EditInvestorsForm from './components/editInvestorsForm'
import BasicDropzone from './components/ReactDropZone'

import './style.css'

// might need TableToolbarAction and batchActionClick here
const { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow,
  TableSelectAll, TableSelectRow, TableToolbar, TableBatchAction, TableBatchActions,
  TableToolbarSearch, TableToolbarContent } = DataTable

type StateProps = {|
  transferManager: TransferManager,
  addresses: Array<string>,
  sell: Array<number>,
  buy: Array<number>,
  investors: Array<Investor>,
  csvMessage: string,
  previewCSVShowing: boolean,
  listLength: number,
|}

type DispatchProps = {|
  initialize: () => any,
  handleUpload: () => any,
  multiSubmit: () => any,
  singleSubmit: () => any,
  getWhitelist: (?Date, ?Date) => any,
  updateListLength: (number) => any,
  removeInvestor: (investors: Array<string>) => any,
  editInvestors: (investors: Array<string>) => any,
|}

const mapStateToProps = (state) => ({
  transferManager: state.whitelist.transferManager,
  addresses: state.whitelist.addresses,
  sell: state.whitelist.sell,
  buy: state.whitelist.buy,
  investors: state.whitelist.investors,
  csvMessage: state.whitelist.csvMessage,
  previewCSVShowing: state.whitelist.previewCSVShowing,
  listLength: state.whitelist.listLength,
})

const mapDispatchToProps = (dispatch: Function) => ({
  initialize: () => dispatch(initialize()),
  handleUpload: (file) => dispatch(uploadCSV(file)),
  multiSubmit: () => dispatch(multiUserSubmit()),
  singleSubmit: () => dispatch(oneUserSubmit()),
  getWhitelist: (calenderStart: Date, calenderEnd: Date) => dispatch(getWhitelist(calenderStart, calenderEnd)),
  updateListLength: (pageNumber: number) => dispatch(listLength(pageNumber)),
  removeInvestor: (investors: Array<string>) => dispatch(removeInvestor(investors)),
  editInvestors: (investors: Array<string>) => dispatch(editInvestors(investors)),
})

type Props = StateProps & DispatchProps

type State = {
  page: number,
  editInvestorsShowing: boolean,
  editInvestors: Array<string>,
}

 type EventData = {
  id: string,
  address: string,
  added: ?string,
  addedBy: ?string,
  from: string,
  to: string,
}

type PageChanger = {
  page: number,
  pageSize: number,
}

type DatePickerType = [Date, Date]

const dateFormat = (date: Date) => date.toLocaleDateString('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

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
        page: 0, // TODO @davekaj: make sure that reseting to initial page is truly needed
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

  //renders the list by making it date strings and splitting up in pages, at the start of the render function
  paginationRendering () {
    let paginatedArray = []
    let investors = this.props.investors
    let pageNum = this.state.page
    let listLength = this.props.listLength
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

  removeInvestor = (dataTableRow: Array<Object>) => {
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
          <TableBatchAction onClick={()=> this.removeInvestor(selectedRows)}>
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
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableSelectRow {...getSelectionProps({ row })} />
              {row.cells.map((cell) => (
                <TableCell key={cell.id}>{cell.value}</TableCell>
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
      <DocumentTitle title='Sign Up – Polymath'>
        <div className='bx--grid'>
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
                <div>
                  <div className='csvModal'>
                  Add multiple addresses to the whitelist by uploading a comma seperated CSV file. The format should be as follows:
                    <ul>
                      <li>Column 1 - Ethereum Address</li>
                      <li>Column 2 - Date mm/dd/yyyy (date when the resale restrictions should be lifted for that address).</li>
                    </ul>
                  </div>
                  <div className='csvModalMini'>
                    You can download a <a href='localhost:3000'>Sample.csv</a> file and edit it
                  </div>
                </div>
                <br />
                <BasicDropzone onHandleUpload={this.props.handleUpload} />
                <FileUploaderButton
                  labelText='Upload From Desktop'
                  className='bob'
                  onChange={this.props.handleUpload}
                  accept={['.csv']}
                  multiple
                  buttonKind='secondary'
                />
                {this.props.previewCSVShowing ? (
                  <div className='csvModalTable'>
                    {/* <div>{this.props.csvMessage}</div> TODO @davekaj: remove this from redux state, it is not needed anymore*/}
                    {/* Below is the data you will be sending to the blockchain, please confirm it is correct, and then click the Send button to continue. */}
                    <br />
                    <table>
                      <tr className='csvPreviewHeader'>
                        <th >Investor's Eth Address</th>
                        <th>Sale Lockup End Date</th>
                        <th>Purchase Lockup End Date</th>
                      </tr>
                      {this.props.addresses.map((user, i) => (
                        <tr key={uuidv4()} className='csvPreviewTable'>
                          <td className='csvModalAddressTable' >{this.props.addresses[i]}</td>
                          <td>{this.props.sell[i]}</td>
                          <td>{this.props.buy[i]}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
                )
                  : null}
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
                />
                <DatePickerInput
                  className='some-class'
                  labelText='End Date Added'
                  placeholder='mm/dd/yyyy'
                  id='date-picker-input-id-2'
                />
              </DatePicker>
            </div>
          </div>
          <DataTable
            rows={paginatedRows}
            headers={TableHeaders}
            render={this.dataTableRender}
          />
          <PaginationV2
            onChange={this.handleChangePages}
            pageSizes={[10, 20, 30, 40, 50]}
            totalItems={this.props.investors.length}
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
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WhitelistPage)
