import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { SafeAppsSdkSigner } from '@gnosis.pm/safe-apps-ethers-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeInfo } from '@gnosis.pm/safe-apps-sdk'
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk/dist/src/sdk'

import { ADDRESS_REGEX, Maybe } from '../utils'
import { ERC20, ERC20__factory as ERC20Factory } from './../types'
import { checkIsContract } from './useIsContract'

const errorValues = {
  error: true,
  token: null,
  decimals: 18,
  balance: BigNumber.from(0),
}

export const fetchToken = async (address: string, safe: SafeInfo, sdk: SafeAppsSDK) => {
  const provider = new SafeAppsSdkSigner(safe, sdk)
  const token = ERC20Factory.connect(address, provider)

  const balance = await token.balanceOf(safe.safeAddress)
  const decimals = await token.decimals()

  const symbol = await token.symbol()
  const name = await token.name()
  const isContract = await checkIsContract(sdk, address)

  if (isContract && decimals && symbol && name) {
    return {
      error: false,
      token: token,
      decimals: decimals,
      balance: balance,
    }
  } else {
    return errorValues
  }
}

export type ERC20Data = {
  token: Maybe<ERC20>
  error: boolean
  balance: BigNumber
  decimals: number
}

export const useERC20 = (address: string) => {
  const { safe, sdk } = useSafeAppsSDK()

  const [token, setToken] = useState<ERC20Data>({
    token: null,
    error: false,
    balance: BigNumber.from(0),
    decimals: 18,
  })

  const setValues = useCallback((values) => {
    setToken(values)
  }, [])

  useEffect(() => {
    if (address && ADDRESS_REGEX.test(address)) {
      fetchToken(address, safe, sdk)
        .then((values) => {
          setValues(values)
        })
        .catch(() => setValues(errorValues))
    }
  }, [address, safe, sdk, setValues])

  return token
}
