import { BigNumber, utils } from 'ethers'
import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'
import { Button, Divider, Loader, Title, Tooltip } from '@gnosis.pm/safe-react-components'

import { DateTimePicker } from './components/DateTimePicker'
import { ERC20Input, Input, WrappedCheckbox } from './components/Input'
import { useERC20 } from './hooks/useERC20'
import { useEasyAuctionContract } from './hooks/useEasyAuctionContract'

type Auction = {
  auctioningToken: string
  biddingToken: string
  sellAmount: string
  minBuyAmount: string
  minFundingThreshold?: string
  orderCancellationEndDate?: string
  auctionEndDate?: string
  minBuyAmountPerOrder?: string
  isAtomicClosureAllowed?: boolean
  allowListManager?: string
  allowListData?: string
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
  const formMethods = useForm<Required<Auction>>({ mode: 'all' })
  const { formState, getValues, reset, watch } = formMethods

  const easyAuction = useEasyAuctionContract()

  const biddingTokenAddress = watch('biddingToken', '')
  const auctioningTokenAddress = watch('auctioningToken', '')
  const sellAmount = watch('sellAmount', '')
  const minFundingThreshold = watch('minFundingThreshold', '0')

  const minBuyAmountPerOrder = watch('minBuyAmountPerOrder', '0.01')
  const allowListManager = watch('allowListManager', '0x0000000000000000000000000000000000000000')
  const allowListData = watch('allowListData', '0x')

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
      if (!biddingToken || !auctioningToken) {
        return
      }
      const auctionParams = { ...DEFAULT_PARAMS, ...params }

      const minBuyAmountInAtoms = utils.parseUnits(auctionParams.minBuyAmount, biddingTokenDecimals)
      const minimumBiddingAmountPerOrder = utils.parseUnits(
        minBuyAmountPerOrder,
        biddingTokenDecimals
      )
      const minFundingThresholdInAtoms = utils.parseUnits(minFundingThreshold, biddingTokenDecimals)

      // TODO Check allowListManager for EOA

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

      // TODO DEFAULT to 0
      const orderCancellationEndDate = moment
        .duration(moment.utc(auctionParams.orderCancellationEndDate).diff(moment.utc()))
        .as('seconds')

      // TODO DEFAULT to now + 360000
      const auctionEndDate = moment
        .duration(moment.utc(auctionParams.auctionEndDate).diff(moment.utc()))
        .as('seconds')

      txs.push({
        to: easyAuction.address,
        value: '0',
        data: easyAuction.interface.encodeFunctionData('initiateAuction', [
          auctioningToken.address,
          biddingToken.address,
          Math.ceil(orderCancellationEndDate),
          Math.ceil(auctionEndDate),
          sellAmountInAtoms,
          minBuyAmountInAtoms,
          minimumBiddingAmountPerOrder,
          minFundingThresholdInAtoms,
          auctionParams.isAtomicClosureAllowed,
          allowListManager,
          utils.defaultAbiCoder.encode(['address'], [allowListData]),
        ]),
      })

      return submitTx(txs)
    },
    [
      allowListData,
      allowListManager,
      auctioningToken,
      biddingToken,
      biddingTokenDecimals,
      easyAuction.address,
      easyAuction.interface,
      minBuyAmountPerOrder,
      minFundingThreshold,
      safe.safeAddress,
      sellAmountInAtoms,
      submitTx,
    ]
  )

  // TODO Extract inputs and his validations
  return (
    <FormProvider {...formMethods}>
      <Container>
        <Title size="md">Start a new Gnosis Auction</Title>
        <Divider />
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="The ERC20's address of the token that should be sold"
        >
          <ERC20Input
            amount={sellAmountInAtoms}
            checkBalance
            label="Auctioning Token"
            name="auctioningToken"
          />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="The ERC20's address of the token that should be bought"
        >
          <ERC20Input checkBalance={false} label="Bidding Token" name="biddingToken" />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="The amount of auctioningTokens to be sold in atoms"
        >
          <Input label="Number of tokens to auction off" name="sellAmount" />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="The amount of biddingToken to be bought at least for selling sellAmount in atoms"
        >
          <Input label="Minimum number of tokens to receive in total" name="minBuyAmount" />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="
          The minimal funding threshold for executing the settlement. If funding is not reached, everyone will get back their investment"
        >
          <Input label="" name="minFundingThreshold" />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="The timestamp (in seconds) until which orders can be canceled"
        >
          <DateTimePicker label="End time for order cancellation" name="orderCancellationEndDate" />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="The timestamp (in seconds) marking the end of the auction"
        >
          <DateTimePicker label="Auction end time" name="auctionEndDate" />
        </Tooltip>

        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="Describes the minimal buyAmount per order placed in the auction. This can be used in order to protect against too high gas costs for the settlement"
        >
          <Input
            label="Minimal buyAmount per order placed in the auction"
            name="minBuyAmountPerOrder"
          />
        </Tooltip>

        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="Describes whether the auction should be allowed to be closed atomically"
        >
          <WrappedCheckbox
            label="Is allowed to be closed atomically"
            name="isAtomicClosureAllowed"
          />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="Contract address for a potential allowListManger contract, if allow listing is wanted for the started auction"
        >
          <Input label="EOA for allowListManager" name="allowListManager" />
        </Tooltip>
        <Tooltip
          arrow
          backgroundColor="rinkeby"
          title="provide data that is needed for the allowListManager"
        >
          <Input label="" name="allowListData" />
        </Tooltip>

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
              !formState.isValid ||
              !biddingToken ||
              errorBiddingToken ||
              errorAuctioningToken ||
              !auctioningToken ||
              formState.isValidating
            }
            onClick={async () => {
              const values = getValues()
              await initiateNewAuction(values)
              reset()
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
