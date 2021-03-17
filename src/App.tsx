import { BigNumber, utils } from 'ethers'
import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'
import { Button, Divider, Loader, Title } from '@gnosis.pm/safe-react-components'

import { DateTimePicker } from './components/DateTimePicker'
import { ERC20Input, Input } from './components/Input'
import { useERC20 } from './hooks/useERC20'
import { useEasyAuctionContract } from './hooks/useEasyAuctionContract'

type Auction = {
  auctioningToken: string
  biddingToken: string
  sellAmount: string
  minBuyAmount: string
  minFundingThreshold?: string
  orderCancellationPeriod?: string
  duration?: string
  minBuyAmountPerOrder?: string
  isAtomicClosureAllowed?: boolean
  allowListManager?: string
}

const DEFAULT_PARAMS = {
  minFundingThreshold: '0',
  orderCancellationPeriod: '0',
  duration: '360000',
  minBuyAmountPerOrder: '0.01',
  isAtomicClosureAllowed: false,
  allowListManager: '0x0000000000000000000000000000000000000000',
}

const Container = styled.form`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;

  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`

const App: React.FC = () => {
  const { safe, sdk } = useSafeAppsSDK()
  const [submitting, setSubmitting] = useState(false)
  const methods = useForm<Required<Auction>>({ mode: 'all' })

  const easyAuction = useEasyAuctionContract()
  const biddingTokenAddress = methods.watch()['biddingToken']
  const auctioningTokenAddress = methods.watch()['auctioningToken']
  const sellAmount = methods.watch()['sellAmount']

  const {
    decimals: biddingTokenDecimals,
    error: errorBiddingToken,
    token: biddingToken,
  } = useERC20({
    address: biddingTokenAddress,
  })
  const {
    decimals: auctioningTokenDecimals,
    error: errorAuctioningToken,
    token: auctioningToken,
  } = useERC20({
    address: auctioningTokenAddress,
  })

  const sellAmountInAtoms = useMemo(() => {
    return auctioningToken && auctioningTokenDecimals && sellAmount && !errorAuctioningToken
      ? utils.parseUnits(sellAmount, auctioningTokenDecimals)
      : BigNumber.from('0')
  }, [auctioningToken, auctioningTokenDecimals, errorAuctioningToken, sellAmount])

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

  const initiateNewAuction = useCallback(
    async (params: Auction) => {
      if (!biddingToken || !auctioningToken) {
        return
      }
      const auctionParams = { ...DEFAULT_PARAMS, ...params }

      const minBuyAmountInAtoms = utils.parseUnits(auctionParams.minBuyAmount, biddingTokenDecimals)
      const minParticipantsBuyAmount = utils.parseUnits(
        auctionParams.minBuyAmountPerOrder,
        biddingTokenDecimals
      )
      const minFundingThresholdInAtoms = utils.parseUnits(
        auctionParams.minFundingThreshold,
        biddingTokenDecimals
      )

      if (auctionParams.allowListManager !== '0x0000000000000000000000000000000000000000') {
        console.error('allowListManager not supported')
      }

      const allowance = await auctioningToken.allowance(safe.safeAddress, easyAuction.address)

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

      const orderCancellationPeriod = moment
        .duration(moment.utc(auctionParams.orderCancellationPeriod).diff(moment.utc()))
        .as('seconds')
      const duration = moment
        .duration(moment.utc(auctionParams.duration).diff(moment.utc()))
        .as('seconds')

      txs.push({
        to: easyAuction.address,
        value: '0',
        data: easyAuction.interface.encodeFunctionData('initiateAuction', [
          auctioningToken.address,
          biddingToken.address,
          Math.ceil(orderCancellationPeriod),
          Math.ceil(duration),
          sellAmountInAtoms,
          minBuyAmountInAtoms,
          minParticipantsBuyAmount,
          minFundingThresholdInAtoms,
          auctionParams.isAtomicClosureAllowed,
          auctionParams.allowListManager,
        ]),
      })
      // eslint-disable-next-line no-warning-comments
      // TODO Check errors and disable submit. Move to effect/memo
      return submitTx(txs)
    },
    [
      auctioningToken,
      biddingToken,
      biddingTokenDecimals,
      easyAuction.address,
      easyAuction.interface,
      safe.safeAddress,
      sellAmountInAtoms,
      submitTx,
    ]
  )

  return (
    <FormProvider {...methods}>
      <Container>
        <Title size="md">Start a new Gnosis Auction</Title>
        <Divider />

        <ERC20Input
          amount={sellAmountInAtoms}
          checkBalance
          label="Auctioning Token"
          name="auctioningToken"
        />
        <ERC20Input checkBalance={false} label="Bidding Token" name="biddingToken" />
        <Input label="Number of tokens to auction off" name="sellAmount" />
        <Input label="Minimum number of tokens to receive in total" name="minBuyAmount" />
        <DateTimePicker label="End time for order cancellation" name="orderCancellationPeriod" />
        <DateTimePicker label="Auction end time" name="duration" />

        {submitting ? (
          <>
            <Loader size="md" />
            <br />
            <Button
              color="secondary"
              onClick={() => {
                setSubmitting(false)
              }}
              size="lg"
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            color="primary"
            disabled={
              !methods.formState.isValid ||
              !biddingToken ||
              errorBiddingToken ||
              errorAuctioningToken ||
              !auctioningToken ||
              methods.formState.isValidating
            }
            onClick={async () => {
              const values = methods.getValues()
              await initiateNewAuction(values)
              methods.reset()
            }}
            size="lg"
          >
            Build transaction
          </Button>
        )}
      </Container>
    </FormProvider>
  )
}

export default App
