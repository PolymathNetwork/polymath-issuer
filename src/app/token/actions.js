// @flow

import React from 'react'
import { SecurityTokenRegistry } from 'polymathjs'
import * as ui from 'polymath-ui'
import type { SecurityToken } from 'polymathjs/types'

import { formName as completeFormName } from './components/CompleteTokenForm'
import { fetch as fetchSTO } from '../sto/actions'
import type { GetState } from '../../redux/reducer'
import type { ExtractReturn } from '../../redux/helpers'

export const DATA = 'token/DATA'
export const data = (token: ?SecurityToken) => ({ type: DATA, token })

// TODO @bshevchenko: replace this with RadioInput from polymath-ui
export const IS_DIVISIBLE = 'token/IS_DIVISIBLE'
export const isDivisible = (value: boolean) => ({ type: IS_DIVISIBLE, value })

export type Action = ExtractReturn<typeof data>

export const fetch = (ticker: string) => async (dispatch: Function) => {
  dispatch(ui.fetching())
  try {
    const expires = new Date()
    expires.setDate(expires.getDate() + 1)
    const token = await SecurityTokenRegistry.getTokenByTicker(ticker)
    dispatch(data(token))
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
  dispatch(fetchSTO())
}

export const complete = () => async (dispatch: Function, getState: GetState) => {
  const token = getState().token.token
  dispatch(
    ui.confirm(
      'Before you proceed with your Token Creation',
      <div>
        <p>Please confirm that all previous information is correct and that you are not violating any trademarks.</p>
        <p>
          Once you hit “CONFIRM”, your Token will be created on the blockchain and will be immutable. Any change will
          require that you start the process over. If you wish to review your information, please select “CANCEL”.
        </p>
      </div>,
      'red',
      async () => {
        // $FlowFixMe
        dispatch(ui.txStart(`Issuing ${token.ticker} token...`))
        try {
          const token: SecurityToken = {
            ...getState().token.token,
            ...getState().form[completeFormName].values,
          }
          const receipt = await SecurityTokenRegistry.generateSecurityToken(
            token.name,
            token.ticker,
            getState().token.isDivisible ? 18 : 0,
            token.details,
          )
          dispatch(fetch(token.ticker))
          dispatch(
            ui.txSuccess('Token Was Issued Successfully', 'Set Up Offering Details', `/dashboard/${token.ticker}/sto`),
          )

          const accountData = ui.getAccountDataForFetch(getState())
          if (!accountData) {
            throw new Error('Not signed in')
          }

          const emailResult = await ui.offchainFetch({
            query: `
              mutation ($account: WithAccountInput!, $input: EmailTokenIssuedInput!) {
                withAccount(input: $account) {
                  sendEmailTokenIssued(input: $input)
                }
              }
            `,
            variables: {
              account: {
                accountData: accountData,
              },
              input: {
                ticker: token.ticker,
                txHash: receipt.transactionHash,
              },
            },
          })

          if (emailResult.errors) {
            // eslint-disable-next-line no-console
            console.error('sendEmailTokenIssued failed:', emailResult.errors)
          }
        } catch (e) {
          dispatch(ui.txFailed(e))
        }
      },
    ),
  )
}
