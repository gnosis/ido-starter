/* eslint-disable no-console */
import { BigNumberish, BytesLike, utils } from 'ethers'
import moment from 'moment'
import { useCallback } from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'

import { useAuctionForm } from './useAuctionForm'
import { fetchToken } from './useERC20'
import { useEasyAuctionContract } from './useEasyAuctionContract'

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
export const useSubmitAuction = () => {
  const { safe, sdk } = useSafeAppsSDK()
  const { getValues } = useAuctionForm()
  const easyAuction = useEasyAuctionContract()

  const submitTx = useCallback(
    async (txs: Transaction[]) => {
      try {
        const { safeTxHash } = await sdk.txs.send({
          txs,
        })
        console.log('Safe TX Hash', safeTxHash)
        const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
        console.log('TX service', safeTx)
        const txReceipt = await sdk.eth.getTransactionReceipt([safeTxHash])
        console.log('txReceipt', txReceipt)

        return safeTx
      } catch (e) {
        console.error('Error sending auction', e)
      }
    },
    [sdk]
  )

  const initiateNewAuction = useCallback(async () => {
    let useDefaultAllowListManager = false
    let useDefaultAllowListData = false

    const {
      allowListData,
      allowListManager,
      auctionEndDate,
      auctioningToken: auctioningTokenAddress,
      biddingToken: biddingTokenAddress,
      isAtomicClosureAllowed,
      minBuyAmount,
      minBuyAmountPerOrder,
      minFundingThreshold,
      orderCancellationEndDate,
      sellAmount,
    } = getValues()

    const { decimals: auctioningTokenDecimals, token: auctioningToken } = await fetchToken(
      auctioningTokenAddress,
      safe,
      sdk
    )

    const { decimals: biddingTokenDecimals, token: biddingToken } = await fetchToken(
      biddingTokenAddress,
      safe,
      sdk
    )

    if (!auctioningToken || !biddingToken) {
      console.error('InitiateNewAuction called without tokens')
      return
    }

    const allowance = await auctioningToken.allowance(safe.safeAddress, easyAuction.address)

    const minBuyAmountInAtoms = utils.parseUnits(minBuyAmount, biddingTokenDecimals)
    const minBuytAmountPerOrderInAtoms = utils.parseUnits(
      minBuyAmountPerOrder as string,
      biddingTokenDecimals
    )
    const minFundingThresholdInAtoms = utils.parseUnits(
      minFundingThreshold as string,
      biddingTokenDecimals
    )
    const sellAmountInAtoms = utils.parseUnits(sellAmount, auctioningTokenDecimals)

    const auctionEndDateMoment = moment(auctionEndDate).seconds(0).milliseconds(0)
    const orderCancellationEndDateMoment = moment(orderCancellationEndDate)
      .seconds(0)
      .milliseconds(0)

    if (!allowListManager) {
      // eslint-disable-next-line no-console
      console.log('AllowListManager not set or not an address')
      useDefaultAllowListManager = true
    }

    if (!allowListData) {
      console.log('AllowListData/Signer not set or not an address')
      useDefaultAllowListData = true
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
      useDefaultAllowListManager
        ? '0x0000000000000000000000000000000000000000'
        : (allowListManager as string),
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
  }, [easyAuction, getValues, safe, sdk, submitTx])

  return { submitTx, initiateNewAuction }
}
