import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Text } from '@gnosis.pm/safe-react-components'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { DateTimePicker } from '../common/DateTimePicker'
import { IconTooltip } from '../common/IconTooltip'
import { InputLineContainer } from '../common/InputLineContainer'

export const AuctionEndDatePicker = () => {
  const formKey: FormKeys = 'auctionEndDate'
  const { errors } = useFormContext()

  const inputError = errors[formKey]

  const error = useMemo(() => {
    if (inputError) return inputError.message
  }, [inputError])

  return (
    <>
      <InputLineContainer>
        <DateTimePicker label={FORM_PARAMETERS[formKey].label} name={formKey} />
        <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
      </InputLineContainer>
      {error && (
        <Text color="error" size="md">
          {error}
        </Text>
      )}
    </>
  )
}
