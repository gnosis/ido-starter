import React, { useEffect, useMemo } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { TextField } from '@gnosis.pm/safe-react-components'

import { DEFAULT_FORM_PARAMS, FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { useERC20 } from '../../hooks/useERC20'
import { ADDRESS_REGEX } from '../../utils'
import { IconTooltip } from '../common/IconTooltip'
import { InputLineContainer } from '../common/InputLineContainer'

const formKey: FormKeys = 'biddingToken'
export const BiddingTokenInput = () => {
  const { label, tooltipText } = FORM_PARAMETERS[formKey]

  const { clearErrors, control, errors, setError } = useFormContext()

  const address = useWatch<string>({ name: formKey, defaultValue: DEFAULT_FORM_PARAMS[formKey] })
  const { error: contractError } = useERC20(address)
  const inputError = errors[formKey]

  useEffect(() => {
    if (contractError) {
      setError(formKey, { type: 'notERC20', message: 'Invalid ERC20' })
    } else if (inputError && inputError.type === 'notERC20') {
      // This check avoid excessive re renderings
      clearErrors(formKey)
    }
  }, [clearErrors, contractError, inputError, setError])

  const error = useMemo(() => {
    if (inputError) {
      return inputError.message
    }
    return ''
  }, [inputError])

  return (
    <InputLineContainer>
      <Controller
        control={control}
        name={formKey}
        render={({ onChange, value }) => (
          <TextField label={label} meta={{ error }} onChange={onChange} value={value || ''} />
        )}
        rules={{
          required: { value: true, message: 'Field required' },
          pattern: { value: ADDRESS_REGEX, message: 'Invalid address' },
        }}
      />
      <IconTooltip tooltipText={tooltipText} />
    </InputLineContainer>
  )
}
