import React from 'react'
import { Controller, RegisterOptions } from 'react-hook-form'

import { Checkbox, TextField } from '@gnosis.pm/safe-react-components'

import { FormKeys } from '../../formConfig'
import { useAuctionForm } from '../../hooks/useAuctionForm'

interface InputProps {
  name: FormKeys
  label: string
  rules?: RegisterOptions
  triggerOnChange?: FormKeys
}

export const Input = ({ rules = {}, label, name, triggerOnChange }: InputProps) => {
  const { control, errors, trigger } = useAuctionForm()

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <TextField
          label={label}
          meta={{ error: errors[name]?.message || '' }}
          onChange={(e) => {
            onChange(e)
            if (triggerOnChange) trigger(triggerOnChange)
          }}
          value={value}
        />
      )}
      rules={rules}
    />
  )
}

export const WrappedCheckbox = ({ label, name }: InputProps) => {
  const { control } = useAuctionForm()

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
