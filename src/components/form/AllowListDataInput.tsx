import React from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { checkIsContract } from '../../hooks/useIsContract'
import { ADDRESS_REGEX } from '../../utils'
import { IconTooltip } from '../common/IconTooltip'
import { Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

export const AllowListDataInput = () => {
  const formKey: FormKeys = 'allowListData'
  const { sdk } = useSafeAppsSDK()
  return (
    <InputLineContainer>
      <Input
        label={FORM_PARAMETERS[formKey].label}
        name={formKey}
        rules={{
          required: false,
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
  )
}
