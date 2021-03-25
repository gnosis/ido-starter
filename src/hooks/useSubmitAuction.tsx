/* eslint-disable no-console */
import { BigNumber, BigNumberish, BytesLike, utils } from 'ethers'
import moment from 'moment'
import { useCallback } from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'

import { ADDRESS_REGEX } from '../utils'
import { useAuctionForm } from './useAuctionForm'
import { fetchToken } from './useERC20'
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
export const useSubmitAuction = () => {
  const { safe, sdk } = useSafeAppsSDK()
  const { getValues, setError } = useAuctionForm()
  const easyAuction = useEasyAuctionContract()

  const submitTx = useCallback(
    async (txs: Transaction[]) => {
      try {
        const { safeTxHash } = await sdk.txs.send({
          txs,
        })
        console.log(safeTxHash)
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
    let formHasErrors = false
    let useDefaultAllowListManager = false
    let useDefaultAllowListData = false

    const values = getValues()
    if (!values) {
      return
    }
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
    } = values

    const {
      balance: auctioningBalance,
      decimals: auctioningTokenDecimals,
      error: auctioningTokenError,
      token: auctioningToken,
    } = await fetchToken(auctioningTokenAddress, safe, sdk)

    if (auctioningTokenError) {
      setError('auctioningToken', { type: 'notERC20', message: 'Invalid ERC20' })
    }

    const {
      decimals: biddingTokenDecimals,
      error: biddingTokenError,
      token: biddingToken,
    } = await fetchToken(biddingTokenAddress, safe, sdk)

    if (biddingTokenError) {
      setError('biddingToken', { type: 'notERC20', message: 'Invalid ERC20' })
    }

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
    if (sellAmountInAtoms && sellAmountInAtoms.gt(BigNumber.from('0'))) {
      if (auctioningBalance.lt(sellAmountInAtoms)) {
        setError('sellAmount', {
          type: 'balance',
          message: 'Not enough auctioning token balance for this amount',
        })
      }
    }

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
  }, [easyAuction.address, easyAuction.interface, getValues, safe, sdk, setError, submitTx])

  return { submitTx, initiateNewAuction }
}
