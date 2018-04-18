// @flow

import { STO } from 'polymathjs'
import type { STOFactory, STODetails, STOPurchase } from 'polymathjs/types'

import * as a from './actions'
import type { Action } from './actions'

export const STAGE_FETCHING = 0
export const STAGE_SELECT = 1
export const STAGE_CONFIGURE = 2
export const STAGE_OVERVIEW = 3

export type STOState = {
  stage: number,
  contract: ?STO,
  details: ?STODetails,
  factories: Array<STOFactory>,
  factory: ?STOFactory,
  purchases: Array<STOPurchase>,
}

const defaultState: STOState = {
  stage: STAGE_FETCHING,
  contract: null,
  details: null,
  factories: [],
  factory: null,
  purchases: [],
}

export default (state: STOState = defaultState, action: Action) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        stage: action.contract ? STAGE_OVERVIEW : STAGE_SELECT,
        contract: action.contract,
        details: action.details,
      }
    case a.FACTORIES:
      return {
        ...state,
        factories: action.factories,
      }
    case a.USE_FACTORY:
      return {
        ...state,
        stage: STAGE_CONFIGURE,
        factory: action.factory,
      }
    case a.PURCHASES:
      return {
        ...state,
        purchases: action.purchases,
      }
    default:
      return state
  }
}
