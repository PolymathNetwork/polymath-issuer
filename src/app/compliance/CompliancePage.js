// @flow
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import DocumentTitle from 'react-document-title'
import { etherscanAddress, addressShortifier, confirm } from 'polymath-ui'
import {
  Button,
  DataTable,
  PaginationV2,
  Modal,
  DatePicker,
  DatePickerInput,
  Icon,
  InlineNotification,
  Toggle,
  TextInput,
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
  disableOwnershipRestrictions,
  enableOwnershipRestrictions,
  updateOwnershipPercentage,
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
  isPercentageEnabled: boolean,
  isPercentagePaused: boolean,
  percentage: number,
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
  confirm: () => any,
  disableOwnershipRestrictions: () => any,
  enableOwnershipRestrictions: (percentage?: number) => any,
  updateOwnershipPercentage: (percentage: number) => any,
  getFreezeStatus: () => any,
  toggleFreeze: (postToggle: ?Function) => any
|}

const mapStateToProps = (state: RootState) => ({
  investors: state.whitelist.investors,
  criticals: state.whitelist.criticals,
  stateListLength: state.whitelist.listLength,
  token: state.token.token,
  isPercentageEnabled: !!state.whitelist.percentageTM.contract,
  isPercentagePaused: state.whitelist.percentageTM.isPaused,
  percentage: Number(state.whitelist.percentageTM.percentage),
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
  confirm,
  disableOwnershipRestrictions,
  enableOwnershipRestrictions,
  updateOwnershipPercentage,
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
  startDateAdded: ?Date,
  endDateAdded: ?Date,
  isPercentageToggled: boolean,
  isFrozenModalOpen: boolean,
|}

const dateFormat = (date: ?Date): string => {
  if (!date) {
    return ''
  }
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
    startDateAdded: null,
    endDateAdded: null,
    isPercentageToggled: false,
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

  handleFreezeModalOpen = () => {
    // $FlowFixMe
    this.props.confirm(
      <div>
        <p>
        Once you hit &laquo;CONFIRM&raquo;, the freeze on all transfers will PREVENT ANY INVESTOR FROM BUYING
        OR SELLING YOUR TOKENS UNTIL YOU RESUME TRANSFERS. Consider notifying all your investors. If you wish
        to review with your Advisors, please select &laquo;CANCEL&raquo;.
        </p>
      </div>,
      () => {
        this.props.toggleFreeze((()=>{
          this.setState({ isFrozenModalOpen: true })
        }))  
      },
      "Pause All Transfers?"
    )
  }

  handleUnfreezeConfirm = () =>{
    this.setState({ isFrozenModalOpen: false })
    this.props.toggleFreeze()
    //todo @JoseMiguelHerrera, isFrozenModalOpen should be set to true if the toggleFreeze()
    //fails, but this would require ui.tx to handle errors, with a "after fail" function
  }

  handleImportModalOpen = () => {
    this.props.resetUploaded()
    this.setState({ isImportModalOpen: true })
  }

  handleImportModalClose = () => {
    this.setState({ isImportModalOpen: false })
  }

  handleImport = () => {
    const { criticals, isPercentagePaused } = this.props // $FlowFixMe
    this.props.confirm(
      <div>
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
                  <th>Sale</th>
                  <th>Purchase</th>
                  <th>KYC/AML</th>
                  {!isPercentagePaused ? <th>Exempt From % Ownership</th> : ''}
                </tr>
              </thead>
              <tbody>
                {criticals.map(([id, address, sale, purchase, expiry, isPercentage]: InvestorCSVRow) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{addressShortifier(address)}</td>
                    <td>{sale}</td>
                    <td>{purchase}</td>
                    <td>{expiry}</td>
                    {!isPercentagePaused ? <td>{isPercentage}</td> : ''}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : ''}
      </div>,
      () => {
        this.props.importWhitelist()
      },
      undefined,
      undefined,
      criticals.length > 0 ? 'whitelist-import-confirm-modal' : '',
    )
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

  handleTogglePercentage = (isToggled: boolean) => {
    const { isPercentageEnabled, isPercentagePaused } = this.props
    if (!isPercentageEnabled) {
      this.setState({ isPercentageToggled: isToggled })
    } else {
      if (isPercentagePaused) {
        this.props.enableOwnershipRestrictions()
      } else {
        this.props.disableOwnershipRestrictions()
      }
    }
  }

  handleApplyPercentage = () => {
    const { isPercentageEnabled } = this.props
    if (isPercentageEnabled) {
      this.props.updateOwnershipPercentage(55) // TODO @bshevchenko
    } else {
      this.props.enableOwnershipRestrictions(44)
    }
  }

  paginationRendering () {
    const { investors, stateListLength, isPercentagePaused, percentage } = this.props
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
        ...(!isPercentagePaused ? { percentage: investor.isPercentage ? percentage + '%' : 'No Limit' } : {}),
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
            Edit
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
            <OverflowMenuItem itemText='Pause All Transfers' onClick={this.handleFreezeModalOpen} />
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
                    <div>
                      {etherscanAddress(
                        cell.value,
                        this.props.isPercentagePaused ? cell.value : addressShortifier(cell.value)
                      )}
                    </div>
                  ) : i === 2 ? (
                    <div>{etherscanAddress(cell.value, addressShortifier(cell.value))}</div>
                  ) : i === (this.props.isPercentagePaused ? 6 : 7) ? (
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
    const { token, investors, isPercentageEnabled, isPercentagePaused } = this.props
    if (!token || !token.address) {
      return <NotFoundPage />
    }
    const paginatedRows = this.paginationRendering()
    return (
      <DocumentTitle title='Compliance – Polymath'>
        <div>
          <Progress />

          <Button
            icon='upload'
            onClick={this.handleImportModalOpen}
            className='import-whitelist-btn'
          >
            Import Whitelist
          </Button>
          <ImportWhitelistModal
            isOpen={this.state.isImportModalOpen}
            onSubmit={this.handleImport}
            onClose={this.handleImportModalClose}
          />

          <p>Enable Ownership Restrictions</p>
          <Toggle
            onToggle={this.handleTogglePercentage}
            toggled={isPercentageEnabled ? !isPercentagePaused : this.state.isPercentageToggled}
            id='percentageToggle'
          />
          {!isPercentagePaused || (!isPercentageEnabled && this.state.isPercentageToggled) ? (
            <div>
              <TextInput disabled id='percentage' value={this.props.percentage} placeholder='%' />
              <Button onClick={this.handleApplyPercentage}>Apply</Button>
            </div>
          ) : ''}
          <p>&nbsp;</p><br />

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
              ...(!isPercentagePaused ? [{ key: 'percentage', header: 'Max % Ownership' }] : []),
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
            modalHeading='Edit'
            passiveModal
          >
            <p className='bx--modal-content__text'>
              Please enter the information below to edit the chosen investors.
            </p>
            <br />
            <EditInvestorsForm onSubmit={this.handleEditSubmit} onClose={this.handleEditModalClose} />
          </Modal>
          <Modal
            className='freeze-transfer-modal'
            open={(this.props.isTokenFrozen && this.state.isFrozenModalOpen)}
            modalHeading=
            {
            <span>
              <Icon name='icon--pause--outline' fill='#E71D32' width='24' height='24' />&nbsp;
              All Transfers Paused
            </span>
            }
            passiveModal
          >
            <p className='bx--modal-content__text'>
            All transfers have been paused, including on-chain secondary markets.
            </p>
            <br />
            <Button onClick={this.handleUnfreezeConfirm} icon='icon--play'>RESUME TRANSFERS&nbsp;</Button>
          </Modal>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompliancePage)
