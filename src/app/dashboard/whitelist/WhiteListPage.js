import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import uuidv4 from 'uuid/v4'
import {
  FileUploader,
  // Button,
  DataTable,
  PaginationV2,
  ModalWrapper,
  Modal,
  // Form,
  // FormGroup,
  // TextInput,
} from "carbon-components-react"

import { uploadCSV, multiUserSubmit, oneUserSubmit, getWhiteList, paginationDivider, listLength, showModal2 } from './actions'
import { TableHeaders } from './tableHeaders'
import InvestorForm from './userForm'

const { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow,
  TableSelectAll, TableSelectRow, TableToolbar, TableBatchAction, TableBatchActions,
  batchActionClick, TableToolbarSearch, TableToolbarContent, TableToolbarAction } = DataTable

class WhiteListPage extends Component {

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

  onHandleMultiSubmitModal1 = () => {
    this.props.showModal2()
  }

  onHandleMultiSubmit = () => {
    this.props.multiSubmit()
    // console.log(this.props.investors)
    this.props.paginationDivider()
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
                id='transactional-modal'
                buttonTriggerText='Import Whitelist'
                modalLabel='Import Whitelist'
                modalHeading='Import Whitelist'
                handleSubmit={this.onHandleMultiSubmitModal1}
                shouldCloseAfterSubmit
              >
                <FileUploader
                  labelTitle={this.props.csvMessage}
                  labelDescription='Add multiple addresses to the whitelist by uploading a comma seperated CSV file. The format should be as follows: Eth Address (address to whitelist), date mm/dd/yyyy)'
                  buttonLabel='IMPORT WHITELIST'
                  filenameStatus='edit'
                  accept={[".csv"]}
                  onChange={this.props.handleUpload}
                  multiple
                />
                {/* <Button
                kind='secondary'
                small
                style={{ marginTop: "1rem" }}
              // onClick={onClick()}
              >
                Clear File
              </Button> */}
              </ModalWrapper>

            </div>
          </div>
          <br />
          {this.props.modalShowing ?
            <div>
              <div>Please click the button below to review your csv upload, and submit the addresses to the Polymath Smart contracts</div>
              <Modal
                // modalProps={{ onBlur: { onBlur() }, onClick: { onClick() }, onFocus: { onFocus() }, …}}
                open
                transactional
                modalHeading='Modal heading'
                modalLabel='Optional label'
                primaryButtonText='Yes, Submit to Blockchain'
                secondaryButtonText='No, I see an error'
                handleSubmit={this.onHandleMultiSubmit}
                onRequestClose
                className='some-class'
              >
                <p className='bx--modal-content__text'>
                  Below is the data you will be sending to the blockchain, please confirm it is correct
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

              </Modal>
            </div>
            : null}

          <br /> <br /> <br />
          <DataTable
            rows={this.props.investorsPaginated[this.state.page]} //wtf why wont this render???
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
              <TableContainer title='DataTable with batch actions'>
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
                    <TableToolbarAction
                      iconName='download'
                      iconDescription='Download'
                      // onClick={action('TableToolbarAction - Download')}
                    />
                    <TableToolbarAction
                      iconName='edit'
                      iconDescription='Edit'
                      // onClick={action('TableToolbarAction - Edit')}
                    />
                    <TableToolbarAction
                      iconName='settings'
                      iconDescription='Settings'
                      // onClick={action('TableToolbarAction - Settings')}
                    />
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
        </div >
      </DocumentTitle >

    )
  }
}

const mapStateToProps = (state) => ({
  addresses: state.whitelist.addresses,
  sell: state.whitelist.sell,
  buy: state.whitelist.buy,
  investors: state.whitelist.investors,
  investorsPaginated: state.whitelist.investorsPaginated,
  csvMessage: state.whitelist.csvMessage,
  modalShowing: state.whitelist.modalShowing,
})

const mapDispatchToProps = (dispatch) => ({
  handleUpload: (e) => dispatch(uploadCSV(e)),
  multiSubmit: () => dispatch(multiUserSubmit()),
  singleSubmit: () => dispatch(oneUserSubmit()),
  getWhiteList: () => dispatch(getWhiteList()),
  paginationDivider: () => dispatch(paginationDivider()),
  updateListLength: (e) => dispatch(listLength(e)),
  showModal2: () => dispatch(showModal2()),

})

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListPage)
