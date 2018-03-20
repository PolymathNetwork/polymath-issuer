import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import {
  FileUploader,
  Button,
  DataTable,
  Search,
  PaginationV2,
  Modal,
  ModalWrapper,
} from "carbon-components-react"

import PropTypes from 'prop-types'

import { uploadCSV, updateSelectedInvestors } from './actions'
import { FakeTableData, FakeTableHeaders } from './fakedata'

const { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableSelectAll, TableSelectRow, TableToolbar, TableBatchAction, TableBatchActions, batchActionClick, TableToolbarSearch, TableToolbarContent, TableToolbarAction } = DataTable

class WhiteListPage extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    sell: PropTypes.array.isRequired,
    buy: PropTypes.array.isRequired,
    fakedata: PropTypes.array.isRequired,
    csvMessage: PropTypes.string.isRequired,
    upload: PropTypes.func.isRequired,
  }

  // handles the button to send to blockchain the csv data within the modal 
  onFormSubmit = (e) => {
    //   e.preventDefault() // Stop form submit

    //   //send to the blockchain here functionality 

  }

  handleUpload = () => {
    // this.props.upload()
    // onClick: this.props.updateSelectedInvestors,

    // this.setState({ modalShowing: true })
  };

  //*TODO: Functionality to add a single address by user input ****
  //*TODO: Have Submit submit the CSV data to fakeData, which is getting rendered by the app . this should be connected to the blockchain, but for now just have it loop itself
  //*TODO: Start end period (do this last) ****

  //TODO: Functionality to remove a single address from the list , or modify its date
  //TODO: Exportable list
  //TODO: Query the whole list of addresses, from events i believe (i dont belive we are storing our own backend)  (can be fake data for now)
  //TODO: put the contracts on testrpc and get it to work (see adam dossa instructions)

  render () {
    return (
      <DocumentTitle title='Sign Up – Polymath'>

        <div className='bx--grid'>
          <div className='bx--row'>
            <div className='bx--col-xs-6'>
              <FileUploader
                labelTitle={this.props.csvMessage}
                labelDescription='Add multiple addresses to the whitelist by uploading a comma seperated CSV file. The format should be as follows: Eth Address (address to whitelist), date mm/dd/yyyy)'
                buttonLabel='IMPORT WHITELIST'
                filenameStatus='edit'
                accept={[".csv"]}
                onChange={this.props.upload}
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
            </div>
          </div>
          <br />
          {this.props.modalShowing ?
            <div>
              <div>Please click the button below to review your csv upload, and submit the addresses to the Polymath Smart contracts</div>
              <ModalWrapper
                // modalProps={{ onBlur: { onBlur() }, onClick: { onClick() }, onFocus: { onFocus() }, …}}
                id='transactional-modal'
                buttonTriggerText='Submit CSV to Blockchain'
                modalLabel='Submit CSV to Blockchain'
                modalHeading='Submit CSV to Blockchain'
                // handleSubmit={handleSubmit()}
                shouldCloseAfterSubmit
              >
                <p className='bx--modal-content__text'>
                  Below is the data you will be sending to the blockchain, please confirm it is correct
                </p>
                <br />
                {this.props.addresses.map((user, i) => (
                  <div>
                    <div>Address: {this.props.addresses[i]}</div>
                    <div>Sell Expiry Time: {this.props.sell[i]} months</div>
                    <div>Buy Expiry Time: {this.props.buy[i]} months</div>
                    <br />
                  </div>
                ))}

              </ModalWrapper>
            </div>
            : null}

          <br /> <br /> <br />
          <DataTable
            rows={FakeTableData}
            headers={FakeTableHeaders}
            render={({
              rows,
              headers,
              getHeaderProps,
              getSelectionProps,
              getBatchActionProps,
              onInputChange,
              selectedRows,
            }) => (
              <TableContainer title='DataTable with batch actions'>
                <TableToolbar>
                  {/* make sure to apply getBatchActionProps so that the bar renders */}
                  <TableBatchActions {...getBatchActionProps()}>
                    {/* inside of you batch actinos, you can include selectedRows */}
                    <TableBatchAction >
                        Ghost
                    </TableBatchAction>
                    <TableBatchAction >
                        Ghost
                    </TableBatchAction>
                    <TableBatchAction >
                        Ghost
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
                    <Button 
                    // onClick={action('Add new row')} 
                      small
                      kind='primary'
                    >
                        Add new
                    </Button>
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
            // onChange={onChange()}
            pageSizes={[10, 20, 30]}
            totalItems={103}
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
  fakedata: state.whitelist.fakedata,
  csvMessage: state.whitelist.csvMessage,
  modalShowing: state.whitelist.modalShowing,
})

const mapDispatchToProps = (dispatch) => ({
  upload: (e) => dispatch(uploadCSV(e)),
  update: () => dispatch(updateSelectedInvestors()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListPage)
