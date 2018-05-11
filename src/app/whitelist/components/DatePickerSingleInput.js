// @flow

/* eslint-disable react/jsx-no-bind */

// TODO @davekaj: get this file merged into the polymath-ui repo, and
// TODO @davekaj: remove the local version of it from here

import React from 'react'
import { DatePicker, DatePickerInput } from 'carbon-components-react'

type Props = {|
  input: {
    name: string,
    [any]: any
  },
  label: string,
  meta: {
    touched: boolean,
    error: string
  },
  className: string,
  placeholder: string,
  [any]: any
|}

export default ({
  input,
  label,
  meta: { touched, error },
  className,
  placeholder,
  ...rest
}: Props) => {
  const invalid = touched && !!error
  return (
    <DatePicker
      id={input.name}
      className={className}
      datePickerType='single'
      // eslint-disable-next-line
      onChange={(date: Date) => {
        input.onChange(date || null)
      }}
      {...rest}
    >
      <DatePickerInput
        labelText={label}
        placeholder={placeholder}
        id={input.name}
        invalid={invalid}
        invalidText={error}
        onClick={()=>{}} // include this to get rid of error being passed onto the component and shown in console
        pattern={null}
      />
    </DatePicker>
  )
}
