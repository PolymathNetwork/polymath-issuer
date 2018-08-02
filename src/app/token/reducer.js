// @flow

import { CONNECTED } from 'polymath-auth'
import { setHelpersNetwork } from 'polymath-ui'
import { CountTransferManager } from 'polymathjs'
import type { SecurityToken, Investor } from 'polymathjs/types'

import * as a from './actions'
import { DATA } from '../providers/actions'
import type { Action, InvestorCSVRow } from './actions'
import type { ServiceProvider } from '../providers/data'

export type TokenState = {
  token: ?SecurityToken,
  isFetched: boolean,
  providers: ?Array<ServiceProvider>,
  mint: {
    uploaded: Array<Investor>,
    uploadedTokens: Array<number>,
    criticals: Array<InvestorCSVRow>,
    isTooMany: boolean,
  },
  countTM: {
    contract: ?CountTransferManager,
    isPaused: boolean,
    count: ?number,
  },
}

const defaultState: TokenState = {
  token: null,
  isFetched: false,
  providers: null,
  mint: {
    uploaded: [],
    uploadedTokens: [],
    criticals: [],
    isTooMany: false,
  },
  countTM: {
    contract: null,
    isPaused: true,
    count: null,
  },
}

export default (state: TokenState = defaultState, action: Action) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        token: action.token,
        isFetched: true,
      }
    case a.COUNT_TM:
      return {
        ...state,
        countTM: {
          contract: action.tm,
          isPaused: action.isPaused,
          count: action.count || state.countTM.count,
        },
      }
    case a.MINT_UPLOADED:
      return {
        ...state,
        mint: {
          uploaded: action.investors,
          uploadedTokens: action.tokens,
          criticals: action.criticals,
          isTooMany: action.isTooMany,
        },
      }
    case a.MINT_RESET_UPLOADED:
      return {
        ...state,
        mint: defaultState.mint,
      }
    case DATA:
      return {
        ...state,
        providers: action.providers,
      }
    case CONNECTED:
      setHelpersNetwork(action.params.name)
      return state
    default:
      return state
  }
}
