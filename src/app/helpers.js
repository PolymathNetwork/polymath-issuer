// @flow

import React from 'react'

const etherscan = (type: string, value: string, label: string) => {
  return (
    <a href={'https://ropsten.etherscan.io/' + type + '/' + value} target='_blank'>
      {label}
    </a>
  )
}

export const etherscanAddress = (address: string) => {
  return etherscan('address', address, address)
}

export const etherscanTx = (hash: string, isHashLabel: boolean = false) => {
  return etherscan('tx', hash, isHashLabel ? hash : 'See on Etherscan')
}

export const etherscanToken = (address: string) => {
  return etherscan('token', address, address)
}

export const thousandsDelimiter = (v: number) =>
  v.toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
