import React, { useMemo } from 'react'
import { Controller } from 'react-hook-form'

import { TextField } from '@gnosis.pm/safe-react-components'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { FormKeys } from '../../formConfig'
import { useAuctionForm } from '../../hooks/useAuctionForm'

interface Props {
  name: FormKeys
  label: string
}

export const DateTimePicker = ({ label, name }: Props) => {
  const { control, errors } = useAuctionForm()

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
          onChange={onChange}
          popperClassName="calendar"
          selected={value}
          showTimeSelect
          timeCaption="time"
          timeFormat="HH:mm"
          timeIntervals={15}
          wrapperClassName="date-picker-wrapper"
        />
      )}
      rules={{ required: true }}
    />
  )
}
