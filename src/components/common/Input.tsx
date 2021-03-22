import { BigNumber } from 'ethers'
import React, { useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox, TextField } from '@gnosis.pm/safe-react-components'

import { useERC20 } from '../../hooks/useERC20'
import { ADDRESS_REGEX } from '../../utils'

interface InputProps {
  name: string
  label: string
  isRequired?: boolean
}

export const Input = ({ isRequired = true, label, name }: InputProps) => {
  const { control, errors } = useFormContext()

  const inputError = errors[name]
  const error = useMemo(() => {
    if (inputError) {
      if (inputError.type === 'required') return 'Field required'
      if (inputError.type === 'min') return 'Value should be greater than 0'
      if (inputError.type === 'manual') return inputError.message
      return 'error'
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
      rules={{ required: isRequired }}
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

interface ERC20InputProps extends InputProps {
  checkBalance: boolean
  amount?: BigNumber
  isRequired?: boolean
}

export const ERC20Input = ({
  amount,
  checkBalance,
  isRequired = true,
  label,
  name,
}: ERC20InputProps) => {
  const { control, errors, setError, watch } = useFormContext()

  const address = watch(name)
  const { balance, error: contractError } = useERC20(address)
  const inputError = errors[name]

  useEffect(() => {
    if (contractError) {
      setError(name, { type: 'notERC20', message: 'Invalid ERC20' })
    }
  }, [address, amount, balance, checkBalance, contractError, name, setError])

  useEffect(() => {
    if (checkBalance && address && amount && amount.gt(BigNumber.from('0'))) {
      if (balance.lt(amount)) {
        setError(name, { type: 'balance', message: 'Not enough balance' })
      }
    }
  }, [address, amount, balance, checkBalance, name, setError])

  const error = useMemo(() => {
    if (inputError?.type === 'required') return 'Field required'
    if (inputError?.type === 'pattern') return 'Invalid address'
    if (inputError?.type === 'notERC20') return 'Invalid ERC20'
    if (inputError?.type === 'balance') return 'Not enough balance'
    return ''
  }, [inputError])

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <TextField label={label} meta={{ error }} onChange={onChange} value={value || ''} />
      )}
      rules={{ required: isRequired, pattern: ADDRESS_REGEX }}
    />
  )
}
