import { BigNumber, utils } from 'ethers'
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
  compareWith?: string
  isRequired?: boolean
}

export const ERC20Input = ({
  checkBalance,
  compareWith,
  isRequired = true,
  label,
  name,
}: ERC20InputProps) => {
  const { clearErrors, control, errors, setError, watch } = useFormContext()

  const amount = watch(compareWith, '')
  const address = watch(name)
  const { balance, decimals, error: contractError, token } = useERC20(address)
  const inputError = errors[name]

  const amountInAtoms = useMemo(() => {
    return checkBalance && token && decimals && amount && !contractError
      ? utils.parseUnits(amount, decimals)
      : BigNumber.from('0')
  }, [checkBalance, token, decimals, amount, contractError])

  useEffect(() => {
    if (contractError) {
      setError(name, { type: 'notERC20', message: 'Invalid ERC20' })
    } else if (errors[name]) {
      // This check avoid excessive re renderings
      clearErrors(name)
    }
  }, [address, amount, balance, checkBalance, clearErrors, contractError, errors, name, setError])

  useEffect(() => {
    if (checkBalance && address && amountInAtoms && amountInAtoms.gt(BigNumber.from('0'))) {
      if (balance.lt(amountInAtoms)) {
        setError(name, { type: 'balance', message: 'Not enough balance' })
      } else if (errors[name]) {
        clearErrors(name)
      }
    }
  }, [address, amount, amountInAtoms, balance, checkBalance, clearErrors, errors, name, setError])

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
