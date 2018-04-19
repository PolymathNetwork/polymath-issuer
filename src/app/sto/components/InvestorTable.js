// @flow

import { DataTable } from 'carbon-components-react'
import React from 'react'
import type { STOPurchase } from 'polymathjs'

const {
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
  rows: Array<STOPurchase>
}) => {
  const rows = []
  let rowId = 1
  for (const row of props.rows) {
    rows.push({
      ...row,
      id: String(rowId),
      amount: row.amount.toString(10),
      paid: row.paid.toString(10),
    })
    rowId++
  }
  return (
    <DataTable
      headers={[
        { key: 'id', header: '#' },
        { key: 'investor', header: 'Ethereum Address of Investor' },
        { key: 'txHash', header: 'Transaction Hash' },
        { key: 'amount', header: 'Tokens Bought' },
        { key: 'paid', header: 'Amount Invested' },
      ]}
      rows={rows}
      render={render}
    />
  )
}
export default InvestorTable
