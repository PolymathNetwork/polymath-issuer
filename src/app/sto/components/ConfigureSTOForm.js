// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button, Tooltip, FormGroup } from 'carbon-components-react'
import {
  TextInput,
  SelectInput,
  DatePickerRangeInput,
  TimePickerInput,
  timeZoneName,
  thousandsDelimiter,
} from 'polymath-ui'
import {
  required,
  integer,
  twelveHourTime,
  dateRange,
  dateRangeTodayOrLater,
  ethereumAddress,
  gt,
} from 'polymath-ui/dist/validate'

export const formName = 'configure_sto'

type Props = {
  handleSubmit: () => void,
}

const defaultCurrency = 'POLY'

const gt0 = gt(0)

type State = {|
  currency: string,
  cap: number,
  rate: number,
  amountOfFunds: string,
|}

class ConfigureSTOForm extends Component<Props, State> {

  state = {
    currency: defaultCurrency,
    cap: 0,
    rate: 0,
    amountOfFunds: '0',
  }

  handleCurrencyChange = (event: Object, newValue: string) => {
    this.setState({ currency: newValue })
  }

  handleCapChange = (event: Object, newValue: string) => {
    this.setState({ cap: Number(newValue) })
    this.updateAmountOfFunds(Number(newValue) / this.state.rate)
  }

  handleRateChange = (event: Object, newValue: string) => {
    this.setState({ rate: Number(newValue) })
    this.updateAmountOfFunds(this.state.cap / Number(newValue))
  }

  pastCheck = (value, allValues) => {
    const startTime = allValues.startTime
    const dateRange = allValues['start-end']
    if (!startTime || !dateRange) {
      return null
    } else {
      let [hours, minutes] = startTime.timeString.split(':')
      if (startTime.dayPeriod === 'PM') {
        hours = parseInt(hours, 10) + 12
      }
      const startDateTime = new Date(dateRange[0].getFullYear(),
        dateRange[0].getMonth(),
        dateRange[0].getDate(),
        hours,
        parseInt(minutes, 10)
      )
      if ((new Date()).getTime() > startDateTime.getTime()) {
        return 'Time is in the past.'
      } else if ((new Date()).getTime() + 600000 > startDateTime.getTime()) {
        return 'Please allow for transaction processing time.'
      }
    }
  }

  updateAmountOfFunds = (value: number) => {
    this.setState({ amountOfFunds: isNaN(value) || value === Infinity ? '0' : thousandsDelimiter(value) })
  }

  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field
          name='start-end'
          component={DatePickerRangeInput}
          label='Start Date;End Date'
          placeholder='mm / dd / yyyy'
          validate={[required, dateRange, dateRangeTodayOrLater]}
        />
        <div className='time-pickers-container'>
          <Field
            name='startTime'
            component={TimePickerInput}
            label='Start Time'
            validate={[twelveHourTime, this.pastCheck]}
          />
          <Field
            name='endTime'
            component={TimePickerInput}
            label={
              <Tooltip triggerText='End Time'>
                <p className='bx--tooltip__label'>
                  Start and End Times
                </p>
                <p>
                  Uses your local time zone, {timeZoneName()}.
                </p>
              </Tooltip>
            }
            validate={[twelveHourTime]}
          />
        </div>
        <Field
          name='currency'
          component={SelectInput}
          label='Raise in'
          placeholder='Choose a currency'
          options={[{ value: 'ETH', label: 'ETH' }, { value: 'POLY', label: 'POLY' }]}
          onChange={this.handleCurrencyChange}
          defaultValue={defaultCurrency}
        />
        <Field
          name='cap'
          component={TextInput}
          label={
            <Tooltip triggerText='Hard Cap (in Tokens)'>
              <p className='bx--tooltip__label'>
                Hard Cap (in Tokens)
              </p>
              <p>
                Hard Cap is the maximum number of tokens available through this offering. e.g. if you want the total
                aggregate of your investors in this offering to own 10 million tokens, enter 10000000.
              </p>
            </Tooltip>
          }
          placeholder='Enter amount'
          onChange={this.handleCapChange}
          validate={[required, integer, gt0]}
        />
        <Field
          name='rate'
          component={TextInput}
          label={
            <Tooltip triggerText='Rate'>
              <p className='bx--tooltip__label'>
                Rate
              </p>
              <p>
                Conversion rate between the currency you chose and your Security Token.
                E.g. 1000 means that 1 ETH (or POLY) will buy 1000 Security Tokens.
              </p>
            </Tooltip>
          }
          placeholder='Enter amount'
          onChange={this.handleRateChange}
          validate={[required, integer, gt0]}
        />
        <Field
          name='fundsReceiver'
          component={TextInput}
          label={
            <Tooltip triggerText='ETH Address to receive the funds raised during the STO'>
              <p className='bx--tooltip__label'>
                Fund Receiver Address
              </p>
              <p>
                The ethereum address that will receive the funds raised through the STO.
              </p>
            </Tooltip>
          }
          placeholder='Enter address'
          validate={[required, ethereumAddress]}
        />
        <FormGroup
          legendText='Amount Of Funds The STO Will Raise'
          style={{ marginTop: '20px', fontSize: '14px' }}
        >
          {this.state.amountOfFunds} {this.state.currency}
        </FormGroup>
        <Button type='submit'>
          DEPLOY AND SCHEDULE STO
        </Button>
        <p className='pui-input-hint'>
          When you launch your security token offering, only whitelisted investors will be able to participate.
          Please make sure to add to the whitelist the ETH addresses deemed suitable by your KYC/AML provider.
        </p>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  initialValues: {
    startTime: {
      timeString: '',
      dayPeriod: 'AM',
    },
    endTime: {
      timeString: '',
      dayPeriod: 'AM',
    },
  },
})(ConfigureSTOForm)
