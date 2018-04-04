//@flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import uuidv4 from 'uuid/v4'
import type { Investor } from 'polymath.js_v2/types'
import type { TableData } from './actions'

// import icons from 'carbon-icons'
import {
  FileUploader,
  DataTable,
  PaginationV2,
  ModalWrapper,
  Modal,
  DatePicker,
  DatePickerInput,
  Icon,
  FileUploaderButton,
} from "carbon-components-react"

import { uploadCSV, multiUserSubmit, oneUserSubmit, getWhiteList, paginationDivider, listLength } from './actions'
import { TableHeaders } from './tableHeaders'
import InvestorForm from './userForm'

const { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow,
  TableSelectAll, TableSelectRow, TableToolbar, TableBatchAction, TableBatchActions,
  batchActionClick, TableToolbarSearch, TableToolbarContent, TableToolbarAction } = DataTable

type Props = {|
|} & StateProps & DispatchProps

class WhiteListPage extends Component<Props> {

  constructor () {
    super()

    this.state = { page: 0 }

  }
  componentWillMount () {
    //call the function to load the events from blcokchain
    this.props.getWhiteList()
  }

  handleInvestorSubmit = () => {
    this.props.singleSubmit()
  }

  // onHandleMultiSubmitModal1 = () => {
  //   this.props.showModal2()
  //   this.props.handleUpload()
  // }

  onHandleMultiSubmit = () => {
    this.props.multiSubmit()
    this.props.paginationDivider()
    return true
  }

  changePages = (e) => {
    this.props.updateListLength(e.pageSize)
    this.props.paginationDivider()
    this.setState({
      page: (e.page - 1),
    })
  }

  //*TODO: Functionality to add a single address by user input **** (connect to the blockchain, fake connection)
  //*TODO: Have Submit submit the CSV data to fakeData, which is getting rendered by the app . this should be connected to the blockchain, but for now just have it loop itself (fake connection)
  //*TODO: Start end period (do this last) ****

  //call API.put and store any json we want, and then call it back. this is off chain storage . will have to update the database in the three ways that we update the whitelist

  //TODO: Functionality to remove a single address from the list , or modify its date
  //TODO: Exportable list
  //TODO: Query the whole list of addresses, from events i believe (i dont belive we are storing our own backend)  (can be fake data for now)
  //TODO: put the contracts on testrpc and get it to work (see adam dossa instructions)

  render () {
    // console.log(this.props.investors)
    return (
      <DocumentTitle title='Sign Up – Polymath'>

        <div className='bx--grid'>
          <div className='bx--row'>
            <div className='bx--col-xs-6'>
              <h2>Whitelist</h2>
              <br />

              <ModalWrapper
                // modalProps={{ onBlur: { onBlur() }, onClick: { onClick() }, onFocus: { onFocus() }, …}}
                id='input-modal'
                buttonTriggerText='Import Whitelist'
                modalLabel=''
                modalHeading='Import Whitelist'
                handleSubmit={this.onHandleMultiSubmit}
                primaryButtonText='Send To Blockchain'
                shouldCloseAfterSubmit
              >
                <div>
                  Add multiple addresses to the whisstelist by uploading a comma seperated CSV file. The format should be as follows:
                  <br /><br />
                  <ul>
                    <li>Column 1 - Ethereum Address</li>
                    <li>Column 2 - Sell Restriction (mm/dd/yyyy)</li>
                    <li>Column 2 - Buy Restriction (mm/dd/yyyy)</li>
                  </ul>
                </div>
                <br />
                <FileUploaderButton
                  labelText='Upload From Desktop'
                  className='bob'
                  onChange={this.props.handleUpload}
                  accept={[".csv"]}
                  multiple
                  buttonKind='secondary'
                />

                {this.props.modalShowing ?
                  <div>
                    <p className='bx--modal-content__text'>
                      <strong>Below is the data you will be sending to the blockchain, please confirm it is correct, and then click the Send button to continue.</strong>
                    </p>
                    <br />
                    {this.props.addresses.map((user, i) => (
                      <div key={uuidv4()}>
                        <div>Address: {this.props.addresses[i]}</div>
                        <div>Sell Expiry Time: {this.props.sell[i]}</div>
                        <div>Buy Expiry Time: {this.props.buy[i]}</div>
                        <br />
                      </div>
                    ))}
                  </div>
                  : null}
              </ModalWrapper>
              <br />

            </div>
          </div>
          <div className='bx--row'>

            <div className='bx--col-xs-2'>
              <DatePicker
                id='date-picker'// onChange={}
                datePickerType='range'
              >
                <DatePickerInput
                  className='some-class'
                  labelText='Date Picker label'
                  // onClick={}//onClick()}
                  // onChange={}//onInputChange()}
                  placeholder='mm/dd/yyyy'
                  id='date-picker-input-id'
                />
                <DatePickerInput
                  className='some-class'
                  labelText='Date Picker label'
                  // onClick={}//onClick()}
                  // onChange={}//onInputChange()}
                  placeholder='mm/dd/yyyy'
                  id='date-picker-input-id-2'
                />
              </DatePicker>
            </div>
          </div>

          <br /> <br />
          <DataTable
            rows={this.props.investorsPaginated[this.state.page]}
            headers={TableHeaders}
            render={({
              rows,
              headers,
              getHeaderProps,
              getSelectionProps,
              getBatchActionProps,
              onInputChange,
              // selectedRows,
            }) => (
              <TableContainer>
                <TableToolbar>
                  {/* make sure to apply getBatchActionProps so that the bar renders */}
                  <TableBatchActions {...getBatchActionProps()}>
                    {/* inside of you batch actinos, you can include selectedRows */}
                    <TableBatchAction >
                        Remove Investor
                    </TableBatchAction>
                    <TableBatchAction >
                        Modify Restriction Dates
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarSearch onChange={onInputChange} />
                  <TableToolbarContent>
                    <ModalWrapper
                      // modalProps={{ onBlur: { onBlur() }, onClick: { onClick() }, onFocus: { onFocus() }, …}}
                      id='transactional-modal'
                      buttonTriggerText='Add New'
                      // modalLabel='Add New Investor'
                      modalHeading='Add New Investor'
                      onSubmit={this.handleInvestorSubmit}
                      shouldCloseAfterSubmit
                    >
                      <p className='bx--modal-content__text'>
                          Please enter the information below to add a single investor.
                      </p>
                      <br />
                      <InvestorForm onSubmit={this.handleInvestorSubmit} />
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
            )}
          />
          <PaginationV2
            onChange={(e) => this.changePages(e)}
            pageSizes={[10, 20, 30, 40, 50]}
            // pageInputDisabled
            totalItems={this.props.investors.length}

          />
        </div>
      </DocumentTitle>

    )
  }
}

type StateProps = {
  addresses: Array<string>,
  sell: Array<number>,
  buy: Array<number>,
  investors: Array<TableData>,
  investorsPaginated: Array<string>,
  csvMessage: string,
  modalShowing: boolean,
}

// const mapDispatchToProps = (dispatch: Function) => ({
//   handleUpload: () => any,
//   multiSubmit: () => any,
//   singleSubmit: () => any,
//   getWhiteList: () => any,
//   paginationDivider: () => any,
//   updateListLength: () => any,
// })

const mapStateToProps = (state) => ({
  addresses: state.whitelist.addresses,
  sell: state.whitelist.sell,
  buy: state.whitelist.buy,
  investors: state.whitelist.investors,
  investorsPaginated: state.whitelist.investorsPaginated,
  csvMessage: state.whitelist.csvMessage,
  modalShowing: state.whitelist.modalShowing,
})

const mapDispatchToProps = (dispatch: Function) => ({
  handleUpload: (e) => dispatch(uploadCSV(e)),
  multiSubmit: () => dispatch(multiUserSubmit()),
  singleSubmit: () => dispatch(oneUserSubmit()),
  getWhiteList: () => dispatch(getWhiteList()),
  paginationDivider: () => dispatch(paginationDivider()),
  updateListLength: (e) => dispatch(listLength(e)),
  // showModal2: () => dispatch(showModal2()),

})

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListPage)
