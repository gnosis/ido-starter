import { utils } from 'ethers'
import React, { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { SafeAppsSdkSigner } from '@gnosis.pm/safe-apps-ethers-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'
import { Button, Divider, Loader, Title } from '@gnosis.pm/safe-react-components'

import { Input } from './components/Input'
import { ERC20__factory as ERC20Factory, EasyAuction__factory as EasyAuctionFactory } from './types'

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

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

const App: React.FC = () => {
  const { safe, sdk } = useSafeAppsSDK()
  const [submitting, setSubmitting] = useState(false)
  const [hasAuctioningTokenBalance, setHasAuctioningTokenBalance] = useState(true)
  const methods = useForm<Required<Auction>>()

  const easyAuction = useMemo(
    () =>
      EasyAuctionFactory.connect(
        '0x99e63218201e44549AB8a6Fa220e1018FDB48f79',
        new SafeAppsSdkSigner(safe, sdk)
      ),
    [sdk, safe]
  )

  const submitTx = useCallback(
    async (txs: Transaction[]) => {
      setSubmitting(true)
      try {
        const { safeTxHash } = await sdk.txs.send({
          txs,
        })
        console.log({ safeTxHash })
        const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
        console.log({ safeTx })
      } catch (e) {
        console.error(e)
      }
      setSubmitting(false)
    },
    [sdk]
  )

  const initiateNewAuction = useCallback(
    async (params: Auction) => {
      console.log('HERE', params)
      const auctionParams = { ...DEFAULT_PARAMS, ...params }

      const auctioningToken = ERC20Factory.connect(
        auctionParams.auctioningToken,
        new SafeAppsSdkSigner(safe, sdk)
      )

      const biddingToken = ERC20Factory.connect(
        auctionParams.biddingToken,
        new SafeAppsSdkSigner(safe, sdk)
      )

      const sellAmountsInAtoms = utils.parseUnits(
        auctionParams.sellAmount,
        await auctioningToken.decimals()
      )
      const minBuyAmountInAtoms = utils.parseUnits(
        auctionParams.minBuyAmount,
        await biddingToken.decimals()
      )
      const minParticipantsBuyAmount = utils.parseUnits(
        auctionParams.minBuyAmountPerOrder,
        await biddingToken.decimals()
      )
      const minFundingThresholdInAtoms = utils.parseUnits(
        auctionParams.minFundingThreshold,
        await biddingToken.decimals()
      )

      if (auctionParams.allowListManager !== '0x0000000000000000000000000000000000000000') {
        console.error('allowListManager not supported')
      }

      const balance = await auctioningToken.balanceOf(safe.safeAddress)
      // TODO Make clearer and simpler
      if (sellAmountsInAtoms.gt(balance)) {
        setHasAuctioningTokenBalance(false)
      } else {
        setHasAuctioningTokenBalance(true)
      }

      const allowance = await auctioningToken.allowance(safe.safeAddress, easyAuction.address)

      const txs: Transaction[] = []

      if (sellAmountsInAtoms.gt(allowance)) {
        txs.push({
          to: auctioningToken.address,
          value: '0',
          data: auctioningToken.interface.encodeFunctionData('approve', [
            easyAuction.address,
            sellAmountsInAtoms,
          ]),
        })
      }

      txs.push({
        to: easyAuction.address,
        value: '0',
        data: easyAuction.interface.encodeFunctionData('initiateAuction', [
          auctioningToken.address,
          biddingToken.address,
          auctionParams.orderCancellationPeriod,
          auctionParams.duration,
          sellAmountsInAtoms,
          minBuyAmountInAtoms,
          minParticipantsBuyAmount,
          minFundingThresholdInAtoms,
          auctionParams.isAtomicClosureAllowed,
          auctionParams.allowListManager,
        ]),
      })

      // TODO Check errors and disable submit. Move to effect/memo
      return submitTx(txs)
    },
    [easyAuction.address, easyAuction.interface, safe, sdk, submitTx]
  )

  return (
    <FormProvider {...methods}>
      <Container>
        <Title size="md">Start a new Gnosis Auction</Title>
        <Divider />

        <Input
          error={!hasAuctioningTokenBalance ? 'Balance Insufficient' : ''}
          label="Auctioning Token"
          name="auctioningToken"
        />
        <Input label="Bidding Token" name="biddingToken" />
        <Input label="Number of tokens to auction off" name="sellAmount" />
        <Input label="Minimum number of tokens to receive in total" name="minBuyAmount" />

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
            onClick={() => {
              //console.log('submit', methods.getValues())
              initiateNewAuction(methods.getValues())
              // initiateNewAuction({
              //   auctioningToken: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
              //   biddingToken: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
              //   sellAmount: '0.1',
              //   minBuyAmount: '50',
              // })
            }}
            size="lg"
          >
            Submit
          </Button>
        )}
      </Container>
    </FormProvider>
  )
}

export default App
