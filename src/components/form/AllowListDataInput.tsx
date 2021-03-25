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
            pattern: (value) => ADDRESS_REGEX.test(value) || 'Invalid address',
            isContract: async (value) => {
              const allowListDataIsContract = await checkIsContract(sdk, value)
              if (allowListDataIsContract) {
                return 'allowListData should be an EOA'
              }
              return true
            },
          },
        }}
      />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
