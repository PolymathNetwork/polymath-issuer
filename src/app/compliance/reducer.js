// @flow

import { TransferManager, PercentageTransferManager } from 'polymathjs'
import { CONTINUE as TX_CONTINUE } from 'polymath-ui/dist/modules/tx/actions'
import type { Investor } from 'polymathjs/types'

import * as a from './actions'
import type { InvestorCSVRow } from './actions'

export type WhitelistState = {|
  transferManager: TransferManager,
  percentageTM: {
    contract: ?PercentageTransferManager,
    isPaused: boolean,
    percentage: number,
  },
  investors: Array<Investor>,
  uploaded: Array<Investor>,
  criticals: Array<InvestorCSVRow>,
  isTooMany: boolean,
  listLength: number,
  freezeStatus: ?boolean,
  isFrozenModalOpen: ?boolean,
|}

const defaultState: WhitelistState = {
  transferManager: null,
  percentageTM: {
    contract: null,
    isPaused: true,
    percentage: 44, // TODO @bshevchenko: set to 0
  },
  investors: [],
  uploaded: [],
  criticals: [],
  isTooMany: false,
  listLength: 10,
  freezeStatus: null,
  isFrozenModalOpen: null,
}

export default (state: WhitelistState = defaultState, action: Object) => {
  switch (action.type) {
    case a.TRANSFER_MANAGER:
      return {
        ...state,
        transferManager: action.transferManager,
      }
    case a.PERCENTAGE_TM:
      return {
        ...state,
        percentageTM: {
          contract: action.tm,
          isPaused: action.isPaused,
          percentage: action.percentage || state.percentageTM.percentage,
        },
      }
    case a.LIST_LENGTH:
      return {
        ...state,
        listLength: action.listLength,
      }
    case a.WHITELIST:
      return {
        ...state,
        investors: [...action.investors],
      }
    case a.UPLOADED:
      return {
        ...state,
        uploaded: action.investors,
        criticals: action.criticals,
        isTooMany: action.isTooMany,
      }
    case a.RESET_UPLOADED:
      return {
        ...state,
        uploaded: [],
        criticals: [],
        isTooMany: false,
      }
    case a.FREEZE_STATUS:
      return{
        ...state,
        freezeStatus: action.freezeStatus, 
      }
    case a.FROZEN_MODAL_STATUS:
      return{
        ...state,
        isFrozenModalOpen: action.isFrozenModalOpen, 
      }
    case TX_CONTINUE:
      if(state.freezeStatus){
        return{
          ...state,
          isFrozenModalOpen: true, 
        }
      }else
      {return state}
    default:
      return state
  }
}
