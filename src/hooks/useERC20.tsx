import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { SafeAppsSdkSigner } from '@gnosis.pm/safe-apps-ethers-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { ADDRESS_REGEX, Maybe } from '../utils'
import { ERC20, ERC20__factory as ERC20Factory } from './../types'
import { checkIsContract } from './useIsContract'

const errorValues = {
  error: true,
  token: null,
  decimals: 18,
  balance: BigNumber.from(0),
}

let isCancelled = false
export const useERC20 = (address: string) => {
  const { safe, sdk } = useSafeAppsSDK()

  const [token, setToken] = useState<Maybe<ERC20>>(null)
  const [error, setError] = useState(false)
  const [balance, setBalance] = useState(BigNumber.from(0))
  const [decimals, setDecimals] = useState(18)

  const setValues = useCallback((values) => {
    if (isCancelled) return
    const { balance, decimals, error, token } = values
    setError(error)
    setToken(token)
    setDecimals(decimals)
    setBalance(balance)
  }, [])

  const fetchToken = useCallback(async () => {
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
  }, [address, safe, sdk])

  useEffect(() => {
    isCancelled = false
    if (address && ADDRESS_REGEX.test(address)) {
      fetchToken()
        .then((values) => {
          setValues(values)
        })
        .catch(() => setValues(errorValues))
    }

    return () => {
      isCancelled = true
    }
  }, [address, fetchToken, safe, sdk, setValues])

  return { token, balance, decimals, error }
}
