import { useMemo } from 'react'

import { SafeAppsSdkSigner } from '@gnosis.pm/safe-apps-ethers-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { EASY_AUCTION_ADDRESSES } from './../networkConfig'
import { EasyAuction__factory as EasyAuctionFactory } from './../types'

export const useEasyAuctionContract = () => {
  const { safe, sdk } = useSafeAppsSDK()

  const easyAuction = useMemo(
    () =>
      EasyAuctionFactory.connect(
        EASY_AUCTION_ADDRESSES[safe.network],
        new SafeAppsSdkSigner(safe, sdk)
      ),
    [sdk, safe]
  )

  return easyAuction
}
