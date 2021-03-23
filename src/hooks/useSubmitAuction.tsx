import { BigNumberish, BytesLike, utils } from 'ethers'
import moment from 'moment'
import { useCallback, useState } from 'react'
import { UseFormMethods } from 'react-hook-form'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'

import { Auction } from '../formConfig'
import { ADDRESS_REGEX } from '../utils'
import { useAllowance } from './useAllowance'
import { useERC20 } from './useERC20'
import { useEasyAuctionContract } from './useEasyAuctionContract'
import { checkIsContract } from './useIsContract'

type ValuesToSend = [
  string,
  string,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  boolean,
  string,
  BytesLike
]
export const useSubmitAuction = (formMethods: UseFormMethods<Required<Auction>>) => {
  const [submitting, setSubmitting] = useState(false)

  const { safe, sdk } = useSafeAppsSDK()
  const { setError, watch } = formMethods
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
  const allowListData = watch('allowListData')

  const sellAmount = watch('sellAmount')
  const isAtomicClosureAllowed = watch('isAtomicClosureAllowed')
  const auctionEndDate = watch('auctionEndDate')
  const orderCancellationEndDate = watch('orderCancellationEndDate')

  const submitTx = useCallback(
    async (txs: Transaction[]) => {
      setSubmitting(true)
      try {
        const { safeTxHash } = await sdk.txs.send({
          txs,
        })
        // eslint-disable-next-line no-console
        console.log(safeTxHash)
        const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
        return safeTx
      } catch (e) {
        console.error('Error sending auction', e)
      }
      setSubmitting(false)
    },
    [sdk]
  )

  const initiateNewAuction = useCallback(async () => {
    let formHasErrors = false
    let useDefaultAllowListManager = false
    let useDefaultAllowListData = false

    if (!auctioningToken || !biddingToken || !allowance) {
      console.error('InitiateNewAuction called without tokens')
      return
    }

    const minBuyAmountInAtoms = utils.parseUnits(minBuyAmount, biddingTokenDecimals)
    const minBuytAmountPerOrderInAtoms = utils.parseUnits(
      minBuyAmountPerOrder,
      biddingTokenDecimals
    )
    const minFundingThresholdInAtoms = utils.parseUnits(minFundingThreshold, biddingTokenDecimals)
    const sellAmountInAtoms = utils.parseUnits(sellAmount, auctioningTokenDecimals)

    const auctionEndDateMoment = moment(auctionEndDate).seconds(0).milliseconds(0)
    const orderCancellationEndDateMoment = moment(orderCancellationEndDate)
      .seconds(0)
      .milliseconds(0)
    const now = moment().seconds(0).milliseconds(0)

    if (auctionEndDateMoment.isBefore(now)) {
      setError('auctionEndDate', {
        type: 'manual',
        message: 'Auction End Date should be in the future',
      })

      formHasErrors = true
    }

    if (orderCancellationEndDateMoment.isBefore(now)) {
      setError('orderCancellationEndDate', {
        type: 'manual',
        message: 'Order cancellation End Date should be in the future',
      })

      formHasErrors = true
    }

    if (orderCancellationEndDateMoment.isAfter(auctionEndDateMoment)) {
      setError('orderCancellationEndDate', {
        type: 'manual',
        message: 'Order cancellation End Date should be before auction End Date',
      })

      formHasErrors = true
    }

    if (allowListManager && ADDRESS_REGEX.test(allowListManager)) {
      const allowListManagerIsContract = await checkIsContract(sdk, allowListManager)
      if (!allowListManagerIsContract) {
        setError('allowListManager', {
          type: 'manual',
          message: `allowListManager should be a contract deployed in ${safe.network}`,
        })
        formHasErrors = true
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('AllowListManager not set or not an address')
      useDefaultAllowListManager = true
    }

    if (allowListData && ADDRESS_REGEX.test(allowListData)) {
      const allowListDataIsContract = await checkIsContract(sdk, allowListData)
      if (allowListDataIsContract) {
        setError('allowListData', { type: 'manual', message: 'allowListData should be an EOA' })
        formHasErrors = true
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('AllowListData/Signer not set or not an address')
      useDefaultAllowListData = true
    }

    if (formHasErrors) {
      throw new Error('Form completed with errors')
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

    const valuesToSend: ValuesToSend = [
      auctioningToken.address,
      biddingToken.address,
      orderCancellationEndDateMoment.unix().toString(),
      auctionEndDateMoment.unix().toString(),
      sellAmountInAtoms,
      minBuyAmountInAtoms,
      minBuytAmountPerOrderInAtoms,
      minFundingThresholdInAtoms,
      !!isAtomicClosureAllowed,
      useDefaultAllowListManager ? '0x0000000000000000000000000000000000000000' : allowListManager,
      useDefaultAllowListData ? '0x' : utils.defaultAbiCoder.encode(['address'], [allowListData]),
    ]

    // eslint-disable-next-line no-console
    console.log('Values sent to the contract, different ordering', valuesToSend)
    txs.push({
      to: easyAuction.address,
      value: '0',
      data: easyAuction.interface.encodeFunctionData('initiateAuction', valuesToSend),
    })

    return submitTx(txs)
  }, [
    allowListData,
    allowListManager,
    allowance,
    auctionEndDate,
    auctioningToken,
    auctioningTokenDecimals,
    biddingToken,
    biddingTokenDecimals,
    easyAuction.address,
    easyAuction.interface,
    isAtomicClosureAllowed,
    minBuyAmount,
    minBuyAmountPerOrder,
    minFundingThreshold,
    orderCancellationEndDate,
    safe.network,
    sdk,
    sellAmount,
    setError,
    submitTx,
  ])

  return { submitTx, submitting, initiateNewAuction }
}
