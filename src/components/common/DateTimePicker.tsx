import moment from 'moment'
import React, { useMemo } from 'react'
import { Controller, RegisterOptions } from 'react-hook-form'

import { TextField } from '@gnosis.pm/safe-react-components'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { FormKeys } from '../../formConfig'
import { useAuctionForm } from '../../hooks/useAuctionForm'

interface Props {
  name: FormKeys
  label: string
  rules?: RegisterOptions
  triggerOnChange?: FormKeys
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeSecondsAndMiliseconds = (date: any) => {
  return date ? moment(date).seconds(0).milliseconds(0).toDate() : date
}

export const DateTimePicker = ({ label, name, rules, triggerOnChange }: Props) => {
  const { control, errors, trigger } = useAuctionForm()

  const now = useMemo(() => new Date(), [])
  const error = errors[name]
  return (
    <Controller
      control={control}
      defaultValue={null}
      name={name}
      render={({ onChange, value }) => (
        <DatePicker
          calendarClassName="calendar"
          customInput={
            <TextField
              label={label}
              meta={{ error: error ? error.message : '' }}
              value={value ? value.toString() : ''}
            />
          }
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={now}
          onChange={(e) => {
            onChange(removeSecondsAndMiliseconds(e))
            if (triggerOnChange) trigger(triggerOnChange)
          }}
          popperClassName="calendar"
          selected={value}
          showTimeSelect
          timeCaption="time"
          timeFormat="HH:mm"
          timeIntervals={15}
          wrapperClassName="date-picker-wrapper"
        />
      )}
      rules={rules}
    />
  )
}
