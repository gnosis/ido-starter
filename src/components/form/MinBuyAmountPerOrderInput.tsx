import React from 'react'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { POSITIVE_NUMBER } from '../../utils'
import { IconTooltip } from '../common/IconTooltip'
import { Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const MinBuyAmountPerOrderInput = () => {
  const formKey: FormKeys = 'minBuyAmountPerOrder'

  return (
    <InputLineContainer>
      <Input
        label={FORM_PARAMETERS[formKey].label}
        name={formKey}
        rules={{
          required: { value: true, message: 'Field is required' },
          pattern: { value: POSITIVE_NUMBER, message: 'Invalid number' },
          validate: {
            min: (value) => value > 0 || 'Minimal bid amount must be greather than 0',
          },
        }}
      />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
