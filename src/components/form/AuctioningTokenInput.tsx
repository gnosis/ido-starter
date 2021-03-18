import { BigNumber, utils } from 'ethers'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { DEFAULT_FORM_PARAMS, FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { useERC20 } from '../../hooks/useERC20'
import { IconTooltip } from '../common/IconTooltip'
import { ERC20Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const AuctioningTokenInput = () => {
  const formKey: FormKeys = 'auctioningToken'
  const { watch } = useFormContext()

  const auctioningTokenAddress = watch(formKey, DEFAULT_FORM_PARAMS[formKey])
  const sellAmount = watch('sellAmount', '')

  const {
    decimals: auctioningTokenDecimals,
    error: auctioningTokenError,
    token: auctioningToken,
  } = useERC20({
    address: auctioningTokenAddress,
  })

  const sellAmountInAtoms = useMemo(() => {
    return auctioningToken && auctioningTokenDecimals && sellAmount && !auctioningTokenError
      ? utils.parseUnits(sellAmount, auctioningTokenDecimals)
      : BigNumber.from('0')
  }, [auctioningToken, auctioningTokenDecimals, auctioningTokenError, sellAmount])

  return (
    <InputLineContainer>
      <ERC20Input
        amount={sellAmountInAtoms}
        checkBalance
        label={FORM_PARAMETERS[formKey].label}
        name={formKey}
      />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
