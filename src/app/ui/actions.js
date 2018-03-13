import { actionGen } from '../../redux/helpers'

export const UI_SETUP_HISTORY = 'ui/SETUP_HISTORY'
export const UI_TX_HASH = 'ui/TX_HASH'
export const UI_TX_END = 'ui/TX_END'

export const setupHistory = actionGen(UI_SETUP_HISTORY)
export const txHash = actionGen(UI_TX_HASH)
export const txEnd = actionGen(UI_TX_END)
