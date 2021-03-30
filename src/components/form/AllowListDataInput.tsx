import React from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { useAuctionForm } from '../../hooks/useAuctionForm'
import { checkIsContract } from '../../hooks/useIsContract'
import { ADDRESS_REGEX } from '../../utils'
import { IconTooltip } from '../common/IconTooltip'
import { Input, WrappedCheckbox } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const AllowListDataInput = () => {
  const isAllowedKey: FormKeys = 'isWhiteListingProcessUsed'
  const formKey: FormKeys = 'allowListData'
  const { watch } = useAuctionForm()
  const { sdk } = useSafeAppsSDK()

  const isWhiteListingProcessUsed = watch(isAllowedKey)

  return (
    <>
      <InputLineContainer>
        <WrappedCheckbox label={FORM_PARAMETERS[isAllowedKey].label} name={isAllowedKey} />
      </InputLineContainer>
      {isWhiteListingProcessUsed && (
        <InputLineContainer>
          <Input
            label={FORM_PARAMETERS[formKey].label}
            name={formKey}
            rules={{
              required: { value: true, message: 'Field is required' },
              validate: {
                pattern: (value) => {
                  if (!value) return true
                  return ADDRESS_REGEX.test(value) || 'Invalid address'
                },
                isContract: async (value) => {
                  if (!value) return true
                  const allowListDataIsContract = await checkIsContract(sdk, value)
                  return allowListDataIsContract ? 'allowListData should be an EOA' : true
                },
              },
            }}
          />
          <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
        </InputLineContainer>
      )}
    </>
  )
}
