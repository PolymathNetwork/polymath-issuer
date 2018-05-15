import * as ui from 'polymath-ui'

import { getProgress, getProviders, saveProgress } from './data'
import type { GetState } from '../../redux/reducer'
import type { SPStatus } from './data'

import { formName } from './ApplyForm'

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

export const emailProviders = (ids: Array<number>) => async (dispatch: Function, getState: GetState) => {
  const values = getState().form[formName].values

  const accountData = ui.getAccountDataForFetch(getState())
  if (!accountData) {
    throw new Error('Not signed in.')
  }

  const application = {};

  ['companyName', 'companyDesc', 'operatedIn', 'incorporatedIn', 'projectURL',
    'profilesURL', 'structureURL', 'otherDetails']
    .forEach((key) => { application[key] = values[key] })

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const emailResult = await ui.offchainFetch({
      query: `
        mutation ($account: WithAccountInput!, $input: EmailApplyProviderInput!) {
          withAccount(input: $account) {
            sendEmailApplyProvider(input: $input)
          }
        }
      `,
      variables: {
        account: {
          accountData,
        },
        input: {
          application: application,
          providerID: id,
        },
      },
    })

    if (emailResult.errors) {
      throw new Error(`Error sending application to provider with ID ${id}: ${emailResult.errors}`)
    }
  }
}

export const applyProviders = (ids: Array<number>) => async (dispatch: Function, getState: GetState) => {
  try {
    await dispatch(emailProviders(ids))

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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('applyProviders failed.', err)
    ui.notify(
      'Something went wrong submitting your application.',
      false,
    )
  }
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
