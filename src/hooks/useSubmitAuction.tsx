import { utils } from 'ethers'
import moment from 'moment'
import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'

import { useAllowance } from './useAllowance'
import { useAmountInAtoms } from './useAmountInAtoms'
import { useERC20 } from './useERC20'
import { useEasyAuctionContract } from './useEasyAuctionContract'
import { useIsContract } from './useIsContract'

export const useSubmitAuction = () => {
  const [submitting, setSubmitting] = useState(false)

  const { safe, sdk } = useSafeAppsSDK()
  const { setError, watch } = useFormContext()
  const easyAuction = useEasyAuctionContract()

  const auctioningTokenAddress = watch('auctioningToken')
  const { decimals: auctioningTokenDecimals, token: auctioningToken } = useERC20(
    auctioningTokenAddress
  )

  const biddingTokenAddress = watch('biddingToken')
  const { decimals: biddingTokenDecimals, token: biddingToken } = useERC20(biddingTokenAddress)

  const allowance = useAllowance(auctioningTokenAddress)

  const minBuyAmount = watch('minBuyAmount')
  const minBuyAmountPerOrder = watch('minBuyAmountPerOrder')
  const minFundingThreshold = watch('minFundingThreshold')
  const allowListManager = watch('allowListManager')
  const allowListManagerIsContract = useIsContract(allowListManager)
  const allowListData = watch('allowListData')
  const allowListDataIsContract = useIsContract(allowListData)

  const sellAmount = watch('sellAmount')
  const isAtomicClosureAllowed = watch('isAtomicClosureAllowed')
  const auctionEndDate = watch('auctionEndDate')
  const orderCancellationEndDate = watch('orderCancellationEndDate')

  const minBuyAmountInAtoms = useAmountInAtoms(minBuyAmount, biddingTokenDecimals)
  const minimumBiddingAmountPerOrder = useAmountInAtoms(minBuyAmountPerOrder, biddingTokenDecimals)
  const minFundingThresholdInAtoms = useAmountInAtoms(minFundingThreshold, biddingTokenDecimals)
  const sellAmountInAtoms = useAmountInAtoms(sellAmount, auctioningTokenDecimals)

  const submitTx = useCallback(
    async (txs: Transaction[]) => {
      setSubmitting(true)
      try {
        const { safeTxHash } = await sdk.txs.send({
          txs,
        })
        await sdk.txs.getBySafeTxHash(safeTxHash)
      } catch (e) {
        console.error(e)
      }
      setSubmitting(false)
    },
    [sdk]
  )

  const initiateNewAuction = useCallback(async () => {
    if (!auctioningToken || !biddingToken || !allowance || !sellAmountInAtoms) {
      console.error('InitiateNewAuction called without tokens')
      return
    }

    if (moment(auctionEndDate).isBefore(moment())) {
      setError('auctionEndDate', {
        type: 'manual',
        message: 'Auction End Date should be in the future',
      })

      return
    }

    if (
      moment(orderCancellationEndDate).isBefore(moment()) ||
      moment(orderCancellationEndDate).isAfter(moment(auctionEndDate))
    ) {
      setError('orderCancellationEndDate', {
        type: 'manual',
        message: 'Order cancellation End Date should be in the future and before auction End Date',
      })

      return
    }

    if (allowListDataIsContract) {
      setError('allowListData', { type: 'manual', message: 'allowListData should be an EOA' })
    }

    if (!allowListManagerIsContract) {
      setError('allowListManager', {
        type: 'manual',
        message: `allowListManager should be a contract deployed in ${safe.network}`,
      })
    }

    const txs: Transaction[] = []

    if (sellAmountInAtoms.gt(allowance)) {
      txs.push({
        to: auctioningToken.address,
        value: '0',
        data: auctioningToken.interface.encodeFunctionData('approve', [
          easyAuction.address,
          sellAmountInAtoms,
        ]),
      })
    }

    txs.push({
      to: easyAuction.address,
      value: '0',
      data: easyAuction.interface.encodeFunctionData('initiateAuction', [
        auctioningToken.address,
        biddingToken.address,
        moment.unix(orderCancellationEndDate).toString(),
        moment.unix(auctionEndDate).toString(),
        sellAmountInAtoms,
        minBuyAmountInAtoms,
        minimumBiddingAmountPerOrder,
        minFundingThresholdInAtoms,
        !!isAtomicClosureAllowed,
        allowListManager,
        utils.defaultAbiCoder.encode(['address'], [allowListData]),
      ]),
    })

    return submitTx(txs)
  }, [
    allowListData,
    allowListDataIsContract,
    allowListManager,
    allowListManagerIsContract,
    allowance,
    auctionEndDate,
    auctioningToken,
    biddingToken,
    easyAuction.address,
    easyAuction.interface,
    isAtomicClosureAllowed,
    minBuyAmountInAtoms,
    minFundingThresholdInAtoms,
    minimumBiddingAmountPerOrder,
    orderCancellationEndDate,
    safe.network,
    sellAmountInAtoms,
    setError,
    submitTx,
  ])

  return { submitTx, submitting, initiateNewAuction }
}
