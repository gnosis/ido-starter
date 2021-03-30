import React, { useEffect } from 'react'

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
  const { unregister, watch } = useAuctionForm()
  const { sdk } = useSafeAppsSDK()

  const isWhiteListingProcessUsed = watch(isAllowedKey)

  useEffect(() => {
    if (!isWhiteListingProcessUsed) {
      unregister(formKey)
    }
  }, [isWhiteListingProcessUsed, unregister])

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
              required: isWhiteListingProcessUsed,
              validate: {
                pattern: (value) => {
                  if (value) ADDRESS_REGEX.test(value) || 'Invalid address'
                  return true
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
