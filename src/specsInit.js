// @flow

import Web3 from 'web3'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Contract from 'polymathjs'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'
import 'jest-enzyme'
import 'jsdom-global/register'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
Enzyme.configure({ adapter: new Adapter() })

const web3 = new Web3('ws://localhost:8545')

export const mockStore = configureMockStore([ thunk ])
// eslint-disable-next-line
export let store = null

let snapshotId

beforeAll(async (done) => {
  const id = await web3.eth.net.getId()
  const [account] = await web3.eth.getAccounts()
  Contract.setParams({ id, account, web3, web3WS: web3, txHashCallback: () => {}, txEndCallback: () => {} })

  web3.currentProvider.send({
    jsonrpc: '2.0',
    method: 'evm_snapshot',
    id: new Date().getTime(),
  }, (err, result) => {
    if (err || !result) {
      done.fail()
      return
    }

    snapshotId = web3.utils.toDecimal(result.result)

    // More to come?
  })
})

afterAll((done) => {
  web3.currentProvider.send({
    jsonrpc: '2.0',
    method: 'evm_revert',
    id: new Date().getTime(),
    params: [snapshotId],
  }, (err) => {
    if (err) {
      done.fail()
      return
    }
  })
})

beforeEach(() => {
  store = mockStore()
})

afterEach(() => {
  Contract.unsubscribe()
})
