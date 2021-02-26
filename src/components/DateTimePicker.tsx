import React from 'react'
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

  return (
    <Controller
      control={control}
      defaultValue={new Date()}
      name={name}
      render={({ onChange, value }) => (
        <DatePicker
          customInput={<TextField label={label} value={value.toString()} />}
          dateFormat="MMMM d, yyyy h:mm aa"
          onChange={onChange}
          selected={value || new Date()}
          showTimeSelect
          timeCaption="time"
          timeFormat="HH:mm"
          timeIntervals={15}
        />
      )}
    />
  )
}
