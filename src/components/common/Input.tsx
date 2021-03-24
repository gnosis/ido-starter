import React, { useMemo } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

import { Checkbox, TextField } from '@gnosis.pm/safe-react-components'

interface InputProps {
  name: string
  label: string
  rules?: RegisterOptions
}

export const Input = ({ rules = {}, label, name }: InputProps) => {
  const { control, errors } = useFormContext()

  const inputError = errors[name]
  const error = useMemo(() => {
    if (inputError && inputError.type) {
      if (inputError.type === 'required') return 'Field required'
      if (inputError.type === 'pattern') return 'Invalid value'

      return inputError.message
    }
    return ''
  }, [inputError])

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <TextField label={label} meta={{ error }} onChange={onChange} value={value || ''} />
      )}
      rules={rules}
    />
  )
}

export const WrappedCheckbox = ({ label, name }: InputProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <Checkbox
          checked={!!value}
          label={label}
          name={name}
          onChange={(e) => onChange(e.target.checked)}
        />
      )}
    />
  )
}
