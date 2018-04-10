// @flow

import { DataTable } from 'carbon-components-react'
import React from 'react'

const {
  // TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} = DataTable

// eslint-disable-next-line react/prop-types
const render = ({ rows, headers, getHeaderProps }) => (
  <Table>
    <TableHead>
      <TableRow>
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
          {row.cells.map((cell) => (
            <TableCell key={cell.id}>{cell.value}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const InvestorTable = (props: {
  rows: Array<Object>
}) => (
  <DataTable
    headers={[
      { key: "number", header: "#" },
      { key: "address", header: "Ethereum Address of Investor" },
      { key: "txHash", header: "Transaction Hash" },
      { key: "tokensBought", header: "Tokens Bought" },
      { key: "amountInvested", header: "Amount Invested" },
    ]}
    rows={props.rows}
    render={render}
  />
)
export default InvestorTable
