import { useMemo } from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { EASY_AUCTION_ADDRESSES, getProvider, Networks } from './../networkConfig'
import { EasyAuction__factory as EasyAuctionFactory } from './../types'

export const useEasyAuctionContract = () => {
  const {
    safe: { chainId },
  } = useSafeAppsSDK()

  const easyAuction = useMemo(() => {
    const provider = getProvider(chainId)
    return EasyAuctionFactory.connect(EASY_AUCTION_ADDRESSES[chainId as Networks], provider)
  }, [chainId])

  return easyAuction
}
