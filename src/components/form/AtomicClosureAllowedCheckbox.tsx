import React from 'react'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { IconTooltip } from '../common/IconTooltip'
import { WrappedCheckbox } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const AtomicClosureAllowedCheckbox = () => {
  const formKey: FormKeys = 'isAtomicClosureAllowed'

  return (
    <InputLineContainer>
      <WrappedCheckbox label={FORM_PARAMETERS[formKey].label} name={formKey} />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
