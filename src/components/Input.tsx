import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField } from '@gnosis.pm/safe-react-components'

interface Props {
  name: string
  label: string
  error?: string
}

export const Input = ({ error, label, name }: Props) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <TextField label={label} meta={{ error }} onChange={onChange} value={value || ''} />
      )}
      //rules={{ required: true, pattern: ADDRESS_REGEX }}
    />
  )
}
