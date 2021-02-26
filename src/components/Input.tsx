import { BigNumber } from 'ethers'
import React, { useCallback, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField } from '@gnosis.pm/safe-react-components'

import { useERC20 } from '../hooks/useERC20'
import { ADDRESS_REGEX } from '../utils'

interface InputProps {
  name: string
  label: string
}

interface ERC20InputProps extends InputProps {
  checkBalance: boolean
  amount?: BigNumber
}

export const Input = ({ label, name }: InputProps) => {
  const { control, errors } = useFormContext()

  const error = useMemo(() => {
    const error = errors[name]
    if (error) {
      if (error.type === 'required') return 'Field required'
      if (error.type === 'min') return 'Value should be greater than 0'
      return 'error'
    }
    return ''
  }, [errors, name])

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <TextField label={label} meta={{ error }} onChange={onChange} value={value || ''} />
      )}
      rules={{ required: true }}
    />
  )
}

export const ERC20Input = ({ amount, label, name }: ERC20InputProps) => {
  const { control, errors, watch } = useFormContext()

  const address = watch()[name]
  const { balance } = useERC20(address)

  const isBalanceEnough = useCallback(async () => {
    if (address && balance && amount) {
      return balance.gt(amount)
    } else {
      return true
    }
  }, [address, amount, balance])

  const error = useMemo(() => {
    const error = errors[name]
    if (error) {
      if (error.type === 'required') return 'Field required'
      if (error.type === 'isBalanceEnough') return 'Not enough balance'
      return 'error'
    }
    return ''
  }, [errors, name])
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <TextField label={label} meta={{ error }} onChange={onChange} value={value || ''} />
      )}
      rules={{ required: true, pattern: ADDRESS_REGEX, validate: { isBalanceEnough } }}
    />
  )
}
