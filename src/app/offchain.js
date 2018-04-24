// @flow

import { createApolloFetch } from 'apollo-fetch'

// eslint-disable-next-line import/prefer-default-export
export const fetchAPI = createApolloFetch({
  uri: (process.env.REACT_APP_OFFCHAIN_URL || 'https://polymath-offchain.herokuapp.com') + '/graphql',
})
