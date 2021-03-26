import { useMemo } from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { EASY_AUCTION_ADDRESSES, getProvider } from './../networkConfig'
import { EasyAuction__factory as EasyAuctionFactory } from './../types'

export const useEasyAuctionContract = () => {
  const {
    safe: { network },
  } = useSafeAppsSDK()

  const easyAuction = useMemo(() => {
    const provider = getProvider(network)

    return EasyAuctionFactory.connect(EASY_AUCTION_ADDRESSES[network], provider)
  }, [network])

  return easyAuction
}
