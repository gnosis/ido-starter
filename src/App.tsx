import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Button, Divider, Loader, Title } from '@gnosis.pm/safe-react-components'

import { AllowListDataInput } from './components/form/AllowListDataInput'
import { AllowListManagerInput } from './components/form/AllowListManagerInput'
import { AtomicClosureAllowedCheckbox } from './components/form/AtomicClosureAllowedCheckbox'
import { AuctionEndDatePicker } from './components/form/AuctionEndDatePicker'
import { AuctioningTokenInput } from './components/form/AuctioningTokenInput'
import { BiddingTokenInput } from './components/form/BiddingTokenInput'
import { MinBuyAmountInput } from './components/form/MinBuyAmountInput'
import { MinBuyAmountPerOrderInput } from './components/form/MinBuyAmountPerOrderInput'
import { MinFundingThresholdInput } from './components/form/MinFundingThresholdInput'
import { OrderCancellationEndDatePicker } from './components/form/OrderCancellationEndDatePicker'
import { SellAmountInput } from './components/form/SellAmountInput'
import { Auction } from './formConfig'

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
  const [submitting, setSubmitting] = useState(false)
  const formMethods = useForm<Required<Auction>>({ mode: 'all', reValidateMode: 'onChange' })
  const { formState, getValues, reset } = formMethods

  return (
    <FormProvider {...formMethods}>
      <Container>
        <Title size="md">Start a new Gnosis Auction</Title>
        <Divider />
        <AuctioningTokenInput />
        <BiddingTokenInput />
        <SellAmountInput />
        <MinBuyAmountInput />
        <Divider />
        <MinFundingThresholdInput />
        <OrderCancellationEndDatePicker />
        <AuctionEndDatePicker />
        <MinBuyAmountPerOrderInput />
        <AtomicClosureAllowedCheckbox />
        <AllowListManagerInput />
        <AllowListDataInput />

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
              // !biddingToken ||
              // errorBiddingToken ||
              // errorAuctioningToken ||
              // !auctioningToken ||
              formState.isValidating
            }
            onClick={async () => {
              const values = getValues()
              console.log('values Form', values)
              //await initiateNewAuction(values)
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
