// @flow

import { createApolloFetch } from 'apollo-fetch'

import { ACCOUNT_KEY } from './account/actions'

export const fetchAPI = createApolloFetch({
  uri: 'http://localhost:3001/graphql',
})

export const getAccountData = () => {
  const accountDataString = localStorage.getItem(ACCOUNT_KEY)

  if (accountDataString == null) {
    throw new Error('Cannot make request to API before signing up.')
  }

  const accountData = JSON.parse(accountDataString)

  return {
    accountJSON: accountData.accountJSON,
    signature: accountData.signature,
  }
}
