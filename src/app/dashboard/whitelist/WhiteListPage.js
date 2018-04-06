//@flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import uuidv4 from 'uuid/v4'
import {
  DataTable,
  PaginationV2,
  ModalWrapper,
  DatePicker,
  DatePickerInput,
  FileUploaderButton,
} from "carbon-components-react"

// import type { Investor } from 'polymath.js_v2/types'
import { TransferManager } from 'polymath.js_v2'
import type { EventData } from './actions'
import { initialize, uploadCSV, multiUserSubmit, oneUserSubmit, getWhitelist, paginationDivider, listLength } from './actions'
import { TableHeaders } from './tableHeaders'
import InvestorForm from './userForm'

//might need TableToolbarAction and batchActionClick here
const { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow,
  TableSelectAll, TableSelectRow, TableToolbar, TableBatchAction, TableBatchActions,
  TableToolbarSearch, TableToolbarContent } = DataTable

type StateProps = {|
  transferManager: TransferManager,
  addresses: Array<string>,
  sell: Array<number>,
  buy: Array<number>,
  investors: Array<EventData>,
  investorsPaginated: Array<Array<EventData>>,
  csvMessage: string,
  modalShowing: boolean,
|}

type DispatchProps = {|
  initialize: () => any,
  handleUpload: () => any,
  multiSubmit: () => any,
  singleSubmit: () => any,
  getWhitelist: () => any,
  paginationDivider: () => any,
  updateListLength: (any) => any,
|}

const mapStateToProps = (state) => ({
  transferManager: state.whitelist.transferManager,
  addresses: state.whitelist.addresses,
  sell: state.whitelist.sell,
  buy: state.whitelist.buy,
  investors: state.whitelist.investors,
  investorsPaginated: state.whitelist.investorsPaginated,
  csvMessage: state.whitelist.csvMessage,
  modalShowing: state.whitelist.modalShowing,
})

const mapDispatchToProps = (dispatch: Function) => ({
  initialize: () => dispatch(initialize()),
  handleUpload: (e) => dispatch(uploadCSV(e)),
  multiSubmit: () => dispatch(multiUserSubmit()),
  singleSubmit: () => dispatch(oneUserSubmit()),
  getWhitelist: () => dispatch(getWhitelist()),
  paginationDivider: () => dispatch(paginationDivider()),
  updateListLength: (e) => dispatch(listLength(e)),
})

type Props = StateProps & DispatchProps

type State = {
  page: number
}

class WhitelistPage extends Component<Props, State> {
  state = {
    page: 0,
  }

  componentWillMount () {
    this.props.initialize()
  }

  handleInvestorSubmit = () => {
    this.props.singleSubmit()
  }

  handleChangePages = (e) => {
    this.props.updateListLength(e.pageSize)
    this.props.paginationDivider() //TODO: i dont want to have to call this here, need to rework updateListLength, cuz it falls if i remove this function
    this.setState({
      page: (e.page - 1),
    })
  }

  onHandleMultiSubmit = () => {
    this.props.multiSubmit()
    return true
  }

  dataTableRender = ({
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
  )

  render () {
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
                    <div>{this.props.csvMessage}</div>
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
                id='date-picker'
                // onChange={}
                datePickerType='range'
              >
                <DatePickerInput
                  className='some-class'
                  labelText='Date Picker label'
                  // onClick={}onClick()}
                  // onChange={}onInputChange()}
                  placeholder='mm/dd/yyyy'
                  id='date-picker-input-id'
                />
                <DatePickerInput
                  className='some-class'
                  labelText='Date Picker label'
                  // onClick={}onClick()}
                  // onChange={}onInputChange()}
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
            render={this.dataTableRender}
          />
          <PaginationV2
            onChange={this.handleChangePages}
            pageSizes={[10, 20, 30, 40, 50]}
            // pageInputDisabled
            totalItems={this.props.investors.length}

          />
        </div>
      </DocumentTitle>

    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WhitelistPage)
