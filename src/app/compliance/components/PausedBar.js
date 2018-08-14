// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Button } from 'carbon-components-react'
import { confirm } from 'polymath-ui'

import { toggleFreeze } from '../actions'
import type { RootState } from '../../../redux/reducer'

type StateProps = {|
  isTokenFrozen: boolean,
|}

type DispatchProps = {|
  confirm: () => any,
  toggleFreeze: ()=> any
|}

const mapStateToProps = (state: RootState): StateProps => ({// $FlowFixMe
  isTokenFrozen: state.whitelist.freezeStatus,
})

const mapDispatchToProps = {
  confirm,
  toggleFreeze,
}

type Props = StateProps & DispatchProps;

class PausedBar extends Component<Props> {

  handleUnFreezeModalOpen = () => {
    // $FlowFixMe
    this.props.confirm(
      <div>
        <p>
        Once you hit &laquo;CONFIRM&raquo;, token transfers WILL BE ENABLED AGAIN, ALLOWING ANY AUTHORIZED INVESTOR
         TO BUY OR SELL YOUR TOKENS. Consider notifying all your investors. If you wish to review with your Advisors,
          please select &laquo;CANCEL&raquo;.
        </p>
      </div>,
      () => {
        this.props.toggleFreeze()
      },
      'Resume All Transfers?'
    )
  }

  render () {
    return (
      (this.props.isTokenFrozen===true) ?
        <div className='pui-pausebar'>
          <div className='pui-pausebar-warning'>
            <Icon name='icon--pause--outline' fill='#E71D32' width='24' height='24' />
            &nbsp;All Transfers Paused&nbsp;&nbsp;
            <p>All transfers have been paused, including on-chain secondary markets.</p>
          </div>
          <ul className='pui-pausebar-menu'>
            <li>
              <Button small onClick={this.handleUnFreezeModalOpen}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                RESUME TRANSFERS &nbsp;
                  <Icon name='icon--play' fill='#FFFFFF' width='16' height='16' />
                </div>
              </Button>
            </li>
          </ul>
        </div>
        :''
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PausedBar)
