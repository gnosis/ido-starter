import React from 'react'
import { useFormContext } from 'react-hook-form'

import { DEFAULT_FORM_PARAMS, FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { useERC20 } from '../../hooks/useERC20'
import { IconTooltip } from '../common/IconTooltip'
import { ERC20Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const BiddingTokenInput = () => {
  const formKey: FormKeys = 'biddingToken'
  const { watch } = useFormContext()

  const biddingTokenAddress = watch(formKey, DEFAULT_FORM_PARAMS[formKey])

  const {
    decimals: biddingTokenDecimals,
    error: biddingTokenError,
    token: biddingToken,
  } = useERC20({
    address: biddingTokenAddress,
  })

  return (
    <InputLineContainer>
      <ERC20Input checkBalance={false} label={FORM_PARAMETERS[formKey].label} name={formKey} />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
