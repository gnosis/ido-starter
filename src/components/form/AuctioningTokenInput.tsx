import { BigNumber, utils } from 'ethers'
import React from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { useAuctionForm } from '../../hooks/useAuctionForm'
import { fetchToken } from '../../hooks/useERC20'
import { ADDRESS_REGEX } from '../../utils'
import { IconTooltip } from '../common/IconTooltip'
import { Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

const formKey: FormKeys = 'auctioningToken'
export const AuctioningTokenInput = () => {
  const { label, tooltipText } = FORM_PARAMETERS[formKey]
  const { safe, sdk } = useSafeAppsSDK()
  const { errors, getValues } = useAuctionForm()

  return (
    <InputLineContainer>
      <Input
        label={label}
        name={formKey}
        rules={{
          required: { value: true, message: 'Field required' },
          pattern: { value: ADDRESS_REGEX, message: 'The address is invalid.' },
          validate: {
            checksum: (value) => {
              try {
                utils.getAddress(value)
                return true
              } catch (e) {
                return 'The address has an invalid checksum'
              }
            },
            validity: async (value) => {
              try {
                const { error } = await fetchToken(value, safe, sdk)
                return !error || 'Invalid ERC20'
              } catch (e) {
                return 'Invalid ERC20'
              }
            },
            balance: async (value) => {
              const { balance, decimals, symbol } = await fetchToken(value, safe, sdk)
              const { sellAmount } = getValues()
              if (sellAmount && !errors['sellAmount']) {
                const sellAmountInAtoms = utils.parseUnits(sellAmount, decimals)
                const balanceInUnits = utils.formatUnits(balance.toString(), decimals)
                const symbolERC20 = symbol.toUpperCase()
                if (sellAmountInAtoms && sellAmountInAtoms.gt(BigNumber.from('0'))) {
                  if (balance.lt(sellAmountInAtoms)) {
                    return `Amount to sell is ${sellAmount} ${symbolERC20} and your balance is ${balanceInUnits} ${symbolERC20}`
                  }
                }
              }
              return true
            },
            notEqual: (value: string) => {
              const { biddingToken } = getValues()
              if (value.toLowerCase() === biddingToken.toLowerCase()) {
                return 'Bidding token and auctioning token must be different'
              }
              return true
            },
          },
        }}
        triggerOnChange="biddingToken"
      />
      <IconTooltip tooltipText={tooltipText} />
    </InputLineContainer>
  )
}
