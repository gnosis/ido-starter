import React, { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField } from '@gnosis.pm/safe-react-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  name: string
  label: string
}
export const DateTimePicker = ({ label, name }: Props) => {
  const { control } = useFormContext()

  const now = useMemo(() => new Date(), [])
  return (
    <Controller
      control={control}
      defaultValue={now}
      name={name}
      render={({ onChange, value }) => (
        <DatePicker
          customInput={<TextField label={label} value={value.toString()} />}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={now}
          onChange={onChange}
          selected={value || now}
          showTimeSelect
          timeCaption="time"
          timeFormat="HH:mm"
          timeIntervals={15}
        />
      )}
    />
  )
}
