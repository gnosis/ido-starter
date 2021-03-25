import { utils } from 'ethers'
import React from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { fetchToken } from '../../hooks/useERC20'
import { ADDRESS_REGEX } from '../../utils'
import { IconTooltip } from '../common/IconTooltip'
import { Input } from '../common/Input'
import { InputLineContainer } from '../common/InputLineContainer'

const formKey: FormKeys = 'biddingToken'
export const BiddingTokenInput = () => {
  const { label, tooltipText } = FORM_PARAMETERS[formKey]
  const { safe, sdk } = useSafeAppsSDK()

  return (
    <InputLineContainer>
      <Input
        label={label}
        name={formKey}
        rules={{
          required: { value: true, message: 'Field required' },
          pattern: { value: ADDRESS_REGEX, message: 'The address is invalid.' },
          validate: {
            checksum: (value: string) => {
              try {
                utils.getAddress(value)
                return true
              } catch (e) {
                return 'The address has an invalid checksum'
              }
            },
            validity: async (value: string) => {
              const { error } = await fetchToken(value, safe, sdk)
              return !error || 'Invalid ERC20'
            },
          },
        }}
      />
      <IconTooltip tooltipText={tooltipText} />
    </InputLineContainer>
  )
}
