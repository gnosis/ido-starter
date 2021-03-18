import { BigNumber } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox, TextField } from '@gnosis.pm/safe-react-components'

import { useERC20 } from '../../hooks/useERC20'
import { ADDRESS_REGEX } from '../../utils'

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

  const inputError = errors[name]
  const error = useMemo(() => {
    if (inputError) {
      if (inputError.type === 'required') return 'Field required'
      if (inputError.type === 'min') return 'Value should be greater than 0'
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
      rules={{ required: true }}
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
        <Checkbox checked={value || false} label={label} name={name} onChange={onChange} />
      )}
    />
  )
}

export const ERC20Input = ({ amount, checkBalance, label, name }: ERC20InputProps) => {
  const { control, errors, watch } = useFormContext()

  const address = watch(name)
  const { balance, error: contractError } = useERC20({ address })
  const [isBalanceEnough, setIsBalanceEnough] = useState(false)
  const inputError = errors[name]

  useEffect(() => {
    if (checkBalance && address && amount && amount.gt(BigNumber.from('0'))) {
      setIsBalanceEnough(balance.gt(amount))
    } else {
      setIsBalanceEnough(true)
    }
  }, [address, amount, balance, checkBalance])

  const error = useMemo(() => {
    if (inputError?.type === 'required') return 'Field required'
    if (inputError?.type === 'pattern') return 'Invalid address'
    if (contractError) return 'Invalid ERC20'
    if (!isBalanceEnough) return 'Not enough balance'
    return ''
  }, [contractError, inputError?.type, isBalanceEnough])

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <TextField label={label} meta={{ error }} onChange={onChange} value={value || ''} />
      )}
      rules={{ required: true, pattern: ADDRESS_REGEX }}
    />
  )
}
