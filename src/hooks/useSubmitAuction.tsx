// const submitTx = useCallback(
//   async (txs: Transaction[]) => {
//     setSubmitting(true)
//     try {
//       const { safeTxHash } = await sdk.txs.send({
//         txs,
//       })
//       console.log({ safeTxHash })
//       const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
//       console.log({ safeTx })
//     } catch (e) {
//       console.error(e)
//     }
//     setSubmitting(false)
//   },
//   [sdk]
// )

// const initiateNewAuction = useCallback(
//   async (params: Auction) => {
//     if (!biddingToken || !auctioningToken) {
//       return
//     }

//     // TODO This should be unnecesary.
//     const auctionParams = { ...DEFAULT_FORM_PARAMS, ...params }

//     const minBuyAmountInAtoms = utils.parseUnits(auctionParams.minBuyAmount, biddingTokenDecimals)
//     const minimumBiddingAmountPerOrder = utils.parseUnits(
//       minBuyAmountPerOrder,
//       biddingTokenDecimals
//     )
//     const minFundingThresholdInAtoms = utils.parseUnits(minFundingThreshold, biddingTokenDecimals)

//     // TODO Check allowListManager for EOA

//     const allowance = await auctioningToken.allowance(safe.safeAddress, easyAuction.address)

//     const txs: Transaction[] = []

//     if (sellAmountInAtoms.gt(allowance)) {
//       txs.push({
//         to: auctioningToken.address,
//         value: '0',
//         data: auctioningToken.interface.encodeFunctionData('approve', [
//           easyAuction.address,
//           sellAmountInAtoms,
//         ]),
//       })
//     }

//     // TODO DEFAULT to 0
//     const orderCancellationEndDate = moment
//       .duration(moment.utc(auctionParams.orderCancellationEndDate).diff(moment.utc()))
//       .as('seconds')

//     // TODO DEFAULT to now + 360000
//     const auctionEndDate = moment
//       .duration(moment.utc(auctionParams.auctionEndDate).diff(moment.utc()))
//       .as('seconds')

//     // TODO allowListManager debería ser boolean
//     txs.push({
//       to: easyAuction.address,
//       value: '0',
//       data: easyAuction.interface.encodeFunctionData('initiateAuction', [
//         auctioningToken.address,
//         biddingToken.address,
//         Math.ceil(orderCancellationEndDate),
//         Math.ceil(auctionEndDate),
//         sellAmountInAtoms,
//         minBuyAmountInAtoms,
//         minimumBiddingAmountPerOrder,
//         minFundingThresholdInAtoms,
//         !!auctionParams.isAtomicClosureAllowed,
//         allowListManager,
//         utils.defaultAbiCoder.encode(['address'], [allowListData]),
//       ]),
//     })

//     return submitTx(txs)
//   },
//   [
//     allowListData,
//     allowListManager,
//     auctioningToken,
//     biddingToken,
//     biddingTokenDecimals,
//     easyAuction.address,
//     easyAuction.interface,
//     minBuyAmountPerOrder,
//     minFundingThreshold,
//     safe.safeAddress,
//     sellAmountInAtoms,
//     submitTx,
//   ]
// )

import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { SafeAppsSdkSigner } from '@gnosis.pm/safe-apps-ethers-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { ADDRESS_REGEX, Maybe } from '../utils'
import { ERC20, ERC20__factory as ERC20Factory } from './../types'

interface Props {
  address: string
}

export const useSubmitAuction = (props: Props) => {
  const { safe, sdk } = useSafeAppsSDK()
  return null
}
