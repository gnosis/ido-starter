import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { SafeAppsSdkSigner } from '@gnosis.pm/safe-apps-ethers-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { ADDRESS_REGEX, Maybe } from '../utils'
import { ERC20, ERC20__factory as ERC20Factory } from './../types'
import { useIsContract } from './useIsContract'

export const useERC20 = (address: string) => {
  const { safe, sdk } = useSafeAppsSDK()

  const [token, setToken] = useState<Maybe<ERC20>>(null)
  const [error, setError] = useState(false)
  const [balance, setBalance] = useState(BigNumber.from(0))
  const [decimals, setDecimals] = useState(18)
  const isContract = useIsContract(token?.address || '')

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const provider = new SafeAppsSdkSigner(safe, sdk)
        const token = ERC20Factory.connect(address, provider)

        const balance = await token.balanceOf(safe.safeAddress)
        const decimals = await token.decimals()

        const symbol = await token.symbol()
        const name = await token.name()

        if (isContract && decimals && symbol && name) {
          setError(false)
          setToken(token)
          setDecimals(decimals)
          setBalance(balance)
        } else {
          setError(true)
          setToken(null)
        }
      } catch (e) {
        setError(true)
        setToken(null)
      }
    }

    if (address && ADDRESS_REGEX.test(address)) {
      fetchToken()
    }
  }, [address, isContract, safe, sdk])

  return { token, balance, decimals, error }
}
