import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { SafeAppsSdkSigner } from '@gnosis.pm/safe-apps-ethers-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useAsyncMemo } from 'use-async-memo'

import { ERC20__factory as ERC20Factory } from './../types'

interface Props {
  address: string
}

export const useERC20 = (props: Props) => {
  const { safe, sdk } = useSafeAppsSDK()
  const address = props ? props.address : ''
  const token = useMemo(() => {
    if (address) {
      return ERC20Factory.connect(address, new SafeAppsSdkSigner(safe, sdk))
    } else {
      return null
    }
  }, [address, safe, sdk])

  const balance = useAsyncMemo(async () => {
    if (token) {
      const balance = await token.balanceOf(safe.safeAddress)
      return balance
    } else {
      return BigNumber.from('0')
    }
  }, [safe, token])

  const decimals = useAsyncMemo(async () => {
    if (token) {
      const decimals = await token.decimals()
      return decimals
    } else {
      return 18
    }
  }, [safe, token])

  return { token, balance, decimals }
}
