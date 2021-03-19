import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { Maybe } from '../utils'
import { useERC20 } from './useERC20'
import { useEasyAuctionContract } from './useEasyAuctionContract'

export const useAllowance = (address: string) => {
  const { safe, sdk } = useSafeAppsSDK()
  const [allowance, setAllowance] = useState<Maybe<BigNumber>>(null)
  const { error, token: tokenToCheckAllowance } = useERC20(address)
  const easyAuction = useEasyAuctionContract()

  useEffect(() => {
    const checkAllowance = async () => {
      try {
        if (tokenToCheckAllowance) {
          const allowance = await tokenToCheckAllowance.allowance(
            safe.safeAddress,
            easyAuction.address
          )
          setAllowance(allowance)
        }
      } catch (e) {
        console.error(`Error at getting allowance of ${tokenToCheckAllowance?.address}`, e)
      }
    }

    if (tokenToCheckAllowance && !error) {
      checkAllowance()
    }
  }, [address, easyAuction.address, error, safe, sdk, tokenToCheckAllowance])

  return allowance
}
