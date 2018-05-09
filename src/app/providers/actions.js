import * as ui from 'polymath-ui'

import { getProgress, getProviders, saveProgress } from './data'
import type { GetState } from '../../redux/reducer'
import type { SPStatus } from './data'

export const DATA = 'providers/DATA'

export const fetchProviders = (ticker: string) => (dispatch: Function) => {
  const progress = getProgress(ticker)
  const providers = []
  for (const provider of getProviders()) {
    providers.push({
      ...provider,
      progress: progress[provider.id],
    })
  }
  dispatch({ type: DATA, providers })
}

export const applyProviders = (ids: Array<number>) => (dispatch: Function, getState: GetState) => {
  // TODO @bshevchenko: send emails to providers with data from form
  // $FlowFixMe
  const { ticker } = getState().token.token
  const progress = getProgress(ticker)
  for (let id of ids) {
    progress[id] = {
      isApplied: true,
    }
  }
  saveProgress(ticker, progress)
  dispatch(ui.notify(
    'Your application has been sent',
    true
  ))
  dispatch(fetchProviders(ticker))
}

export const iHaveMyOwnProviders = (cat: number) => (dispatch: Function, getState: GetState) => {
  // $FlowFixMe
  const { ticker } = getState().token.token
  const progress = getProgress(ticker)
  for (const provider of getProviders()) {
    if (provider.cat === cat) {
      if (!progress[provider.id]) {
        progress[provider.id] = {
          isApplied: false,
        }
      }
    }
  }
  saveProgress(ticker, progress)
  dispatch(fetchProviders(ticker))
}

export const setProviderStatus = (id: number, status: SPStatus) => (dispatch: Function, getState: GetState) => {
  // $FlowFixMe
  const { ticker } = getState().token.token
  const progress = getProgress(ticker)
  progress[id].status = status
  saveProgress(ticker, progress)
  dispatch(fetchProviders(ticker))
}
