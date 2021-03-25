import React, { useMemo } from 'react'
import { Controller } from 'react-hook-form'

import { TextField } from '@gnosis.pm/safe-react-components'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { useAuctionForm } from '../../hooks/useAuctionForm'
import { ADDRESS_REGEX } from '../../utils'
import { IconTooltip } from '../common/IconTooltip'
import { InputLineContainer } from '../common/InputLineContainer'

const formKey: FormKeys = 'biddingToken'
export const BiddingTokenInput = () => {
  const { label, tooltipText } = FORM_PARAMETERS[formKey]

  const { control, errors } = useAuctionForm()

  const inputError = errors[formKey]

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
