import React from 'react'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { IconTooltip } from '../common/IconTooltip'
import { Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const AllowListManagerInput = () => {
  const formKey: FormKeys = 'allowListManager'

  return (
    <InputLineContainer>
      <Input isRequired={false} label={FORM_PARAMETERS[formKey].label} name={formKey} />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
