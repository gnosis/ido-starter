import React from 'react'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { IconTooltip } from '../common/IconTooltip'
import { ERC20Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const AuctioningTokenInput = () => {
  const formKey: FormKeys = 'auctioningToken'

  return (
    <InputLineContainer>
      <ERC20Input
        checkBalance
        compareWith="sellAmount"
        label={FORM_PARAMETERS[formKey].label}
        name={formKey}
      />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
