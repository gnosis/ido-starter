import React from 'react'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { IconTooltip } from '../common/IconTooltip'
import { ERC20Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const BiddingTokenInput = () => {
  const formKey: FormKeys = 'biddingToken'

  return (
    <InputLineContainer>
      <ERC20Input checkBalance={false} label={FORM_PARAMETERS[formKey].label} name={formKey} />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
