// @flow

import React from 'react'
import { SecurityTokenRegistry, CountTransferManager } from 'polymathjs'
import * as ui from 'polymath-ui'
import moment from 'moment'
import { ethereumAddress } from 'polymath-ui/dist/validate'
import type { SecurityToken, Investor, Address } from 'polymathjs/types'

import { formName as completeFormName } from './components/CompleteTokenForm'
import { fetch as fetchSTO } from '../sto/actions'
import { PERMANENT_LOCKUP_TS } from '../compliance/actions'
import CreatedEmail from './components/CreatedEmail'
import type { GetState } from '../../redux/reducer'
import type { ExtractReturn } from '../../redux/helpers'

export const MINT_UPLOADED = 'token/mint/UPLOADED'
export const MINT_RESET_UPLOADED = 'token/mint/RESET_UPLOADED'
export const mintResetUploaded = () => ({ type: MINT_RESET_UPLOADED })

export const DATA = 'token/DATA'
export const data = (token: ?SecurityToken) => ({ type: DATA, token })

export const COUNT_TM = 'token/COUNT_TM'
export const countTransferManager = (tm: CountTransferManager, isPaused: boolean, count?: ?number) =>
  ({ type: COUNT_TM, tm, isPaused, count })

export type Action =
  | ExtractReturn<typeof data>

export type InvestorCSVRow = [number, string, string, string, string, string]

export const fetch = (ticker: string, _token?: SecurityToken) => async (dispatch: Function) => {
  dispatch(ui.fetching())
  try {
    const token: SecurityToken = _token || (await SecurityTokenRegistry.getTokenByTicker(ticker))
    dispatch(data(token))

    let countTM
    if (token.contract) { // $FlowFixMe
      countTM = await token.contract.getCountTM()
      if (countTM) {
        dispatch(countTransferManager(
          countTM,
          await countTM.paused(),
          await countTM.maxHolderCount()
        ))
      }
    }

    if (!token.contract || !countTM) {
      dispatch(countTransferManager(null, true, null))
    }

    dispatch(fetchSTO())
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

export const issue = (isLimitNI: boolean) => async (dispatch: Function, getState: GetState) => {
  const fee = await SecurityTokenRegistry.registrationFee()
  const feeView = ui.thousandsDelimiter(fee) // $FlowFixMe
  let { token } = getState().token // $FlowFixMe
  const ticker = token.ticker
  dispatch(ui.confirm(
    <div>
      <p>Completion of your token creation will require {isLimitNI?'three':'two'} wallet transactions.</p>
      <p>- The first transaction will be used to pay for the token creation cost of:</p>
      <div className='bx--details poly-cost'>{feeView} POLY</div>
      <p>
        - The second transaction will be used to pay the mining fee (aka gas fee) to complete the creation of
        your token.
      </p>
      {isLimitNI &&
      <p>
        - The third transaction will be used to pay the mining fee (aka gas fee) to limit the number of investors who
        can hold your token.
        <br />
      </p>
      }
      <p>
        Please hit &laquo;CONFIRM&raquo; when you are ready to proceed. Once you hit &laquo;CONFIRM&raquo;, your
         security token will be created on the blockchain and will be immutable. Any change to the token structure
          (divisibility or information link) will require that you start the process over using another token symbol.
        <br />If you do not wish to pay the token creation fee or wish to review your information,
            simply select &laquo;CANCEL&raquo;.
      </p>

    </div>,
    async () => {// $FlowFixMe
      if (getState().pui.account.balance.lt(fee)) {
        dispatch(ui.faucet(`The creation of a security token has a fixed cost of ${feeView} POLY.`))
        return
      }
      dispatch(ui.tx(
        ['Approving POLY Spend', 'Creating Security Token', ...(isLimitNI ? ['Limiting Number Of Investors'] : [])],
        async () => {
          const { values } = getState().form[completeFormName]
          token = {
            ...getState().token.token,
            ...values,
          }
          token.isDivisible = token.isDivisible !== '1'
          const receipt = await SecurityTokenRegistry.generateSecurityToken(token)

          if (isLimitNI) {
            token = await SecurityTokenRegistry.getTokenByTicker(ticker)
            await token.contract.setCountTM(values.investorsNumber)
          }

          dispatch(ui.email(
            receipt.transactionHash,
            token.ticker + ' Token Created on Polymath',
            <CreatedEmail ticker={token.ticker} txHash={receipt.transactionHash} />
          ))
        },
        'Token Was Issued Successfully',
        () => {// $FlowFixMe
          return dispatch(fetch(ticker, isLimitNI ? token : undefined))
        },
        `/dashboard/${ticker}`,
        undefined,
        false,
        ticker.toUpperCase() + ' Token Creation'
      ))
    },
    `Before you Proceed with Your ${ticker.toUpperCase()} Token Creation`,
    undefined,
    'pui-large-confirm-modal'
  ))
}

// TODO @bshevchenko: almost duplicates uploadCSV from compliance/actions, subject to refactor
export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    const investors: Array<Investor> = []
    const criticals: Array<InvestorCSVRow> = []
    const tokens: Array<number> = []
    let isTooMany = false
    let string = 0
    // $FlowFixMe
    for (let entry of reader.result.split(/\r\n|\n/)) {
      string++
      const [address, sale, purchase, expiryIn, tokensIn] = entry.split(',')
      const handleDate = (d: string) => d === '' ? new Date(PERMANENT_LOCKUP_TS) : new Date(Date.parse(d))
      const from = handleDate(sale)
      const to = handleDate(purchase)
      const expiry = new Date(Date.parse(expiryIn))
      const tokensVal = Number(tokensIn)

      let isDuplicatedAddress = false
      investors.forEach((investor) => {
        if (investor.address === address) {
          isDuplicatedAddress = true
        }
      })

      if (!isDuplicatedAddress && ethereumAddress(address) === null && !isNaN(from) && !isNaN(to) && !isNaN(expiry)
        && Number.isInteger(tokensVal) && tokensVal > 0) {
        if (investors.length === 75) {
          isTooMany = true
          continue
        }
        investors.push({ address, from, to, expiry })
        tokens.push(tokensVal)
      } else {
        criticals.push([string, address, sale, purchase, expiryIn, tokensIn])
      }
    }
    dispatch({ type: MINT_UPLOADED, investors, tokens, criticals, isTooMany })
  }
}

export const mintTokens = () => async (dispatch: Function, getState: GetState) => {
  const { token, mint: { uploaded, uploadedTokens } } = getState().token // $FlowFixMe
  const transferManager = await token.contract.getTransferManager()

  dispatch(ui.tx(
    ['Whitelisting Addresses', 'Minting Tokens'],
    async () => {
      await transferManager.modifyWhitelistMulti(uploaded, false)
      const addresses: Array<Address> = []
      for (let investor: Investor of uploaded) {
        addresses.push(investor.address)
      } // $FlowFixMe
      await token.contract.mintMulti(addresses, uploadedTokens)
    },
    'Tokens were successfully minted',
    () => {
      return dispatch(mintResetUploaded())
    },
    undefined,
    undefined,
    true // TODO @bshevchenko
  ))
}

export const limitNumberOfInvestors = (count?: number) => async (dispatch: Function, getState: GetState) => {
  const oldCount = getState().token.countTM.count
  const tm = getState().token.countTM.contract
  dispatch(ui.confirm(
    tm && oldCount ? (
      <div>
        <p>
          Please confirm that you want to change the limit on the
          number of token holders to <strong>{ui.thousandsDelimiter(oldCount)}</strong>.
        </p>
        <p>
          Note that all transactions that would result in a number of token holders greater than the
          limit will fail. Please make sure your Investors are informed accordingly.
        </p>
      </div>
    ) : (
      <div>
        <p>Please confirm that you want to set a limit to the number of token holders.</p>
        <p>
          Note that all transactions that would result in a number of token holders greater than the
          limit will fail. Please make sure your Investors are informed accordingly.
        </p>
      </div>
    ),
    async () => { // $FlowFixMe
      if (tm) {
        dispatch(ui.tx(
          'Resuming Token Holders Number Limit',
          async () => {
            await tm.unpause()
          },
          'Token holders number limit has been resumed successfully',
          () => {
            dispatch(countTransferManager(tm, false))
          },
          undefined,
          undefined,
          true // TODO @bshevchenko
        ))
      } else { // $FlowFixMe
        const st: SecurityToken = getState().token.token.contract
        dispatch(ui.tx(
          'Enabling Token Holders Number Limit',
          async () => {
            await st.setCountTM(count)
          },
          'Token holders number limit has been enabled successfully',
          async () => {
            dispatch(countTransferManager(await st.getCountTM(), false, count))
          },
          undefined,
          undefined,
          true // TODO @bshevchenko
        ))
      }
    },
    'Enabling Limit on the Number of Token Holders'
  ))
}

export const unlimitNumberOfInvestors = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.confirm(
    <div>
      <p>
        Please confirm that you want to disable limit on the number of token holders.
      </p>
    </div>,
    async () => {
      const tm = getState().token.countTM.contract
      dispatch(ui.tx(
        'Pausing Token Holders Number Limit',
        async () => { // $FlowFixMe
          await tm.pause()
        },
        'Token holders number limit has been paused successfully',
        async () => {
          dispatch(countTransferManager(tm, true))
        },
        undefined,
        undefined,
        true // TODO @bshevchenko
      ))
    }
  ))
}

export const updateMaxHoldersCount = (count: number) => async (dispatch: Function, getState: GetState) => {
  const oldCount = Number(getState().token.countTM.count)
  const oldCountText = ui.thousandsDelimiter(oldCount)
  const tm = getState().token.countTM.contract
  dispatch(ui.confirm(
    <div>
      <p>
        Please confirm that you want to change the limit on the
        number of token holders from <strong>{oldCountText}</strong> to <strong>{ui.thousandsDelimiter(count)}</strong>.
      </p>
      {count < oldCount ? (
        <p>
          Note that this operation will reduce the limit on the number of token holders.
          As such, only transactions that would result in a reduction of the number of
          token holders will be allowed. All other transactions, whether they would maintain or increase the number
          of token holders will fail. Please make sure your Investors are informed accordingly.
        </p>
      ) : ''}
    </div>,
    async () => {
      dispatch(ui.tx(
        'Updating max holders count',
        async () => { // $FlowFixMe
          await tm.changeHolderCount(count)
        },
        'Max holders count has been successfully updated',
        async () => {
          dispatch(countTransferManager(tm, false, count))
        },
        undefined,
        undefined,
        true // TODO @bshevchenko
      ))
    }
  ))
}

export const exportMintedTokensList = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.confirm(
    <p>Are you sure you want to export minted tokens list?<br />It may take a while.</p>,
    async () => {
      dispatch(ui.fetching())
      try {
        const { token } = getState().token // $FlowFixMe
        const investors = await token.contract.getMinted()

        let csvContent = 'data:text/csv;charset=utf-8,'
        let isFirstLine = true
        investors.forEach((investor: Investor) => {
          csvContent += (!isFirstLine ? '\r\n' : '') + [
            investor.address, // $FlowFixMe
            investor.from.getTime() === PERMANENT_LOCKUP_TS ? '' : moment(investor.from).format('MM/DD/YYYY'),
            // $FlowFixMe
            investor.to.getTime() === PERMANENT_LOCKUP_TS ? '' : moment(investor.to).format('MM/DD/YYYY'),
            moment(investor.expiry).format('MM/DD/YYYY'), // $FlowFixMe
            investor.minted.toString(10),
          ].join(',')
          isFirstLine = false
        })

        window.open(encodeURI(csvContent))

        dispatch(ui.fetched())
      } catch (e) {
        dispatch(ui.fetchingFailed(e))
      }
    },
    'Proceeding with Minted Tokens List Export'
  ))
}
