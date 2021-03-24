import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Divider, Title } from '@gnosis.pm/safe-react-components'

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
import { SubmitForm } from './components/form/SubmitForm'
import { Auction, DEFAULT_FORM_PARAMS } from './formConfig'

const Container = styled.form`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 760px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: auto;
`

const App: React.FC = () => {
  const formMethods = useForm<Required<Auction>>({
    mode: 'all',
    defaultValues: DEFAULT_FORM_PARAMS,
  })

  return (
    <FormProvider {...formMethods}>
      <Container>
        <Title size="md">Start a new Gnosis Auction</Title>
        <Divider />
        <AuctioningTokenInput />
        <BiddingTokenInput />
        <SellAmountInput />
        <MinBuyAmountInput />
        <MinFundingThresholdInput />
        <OrderCancellationEndDatePicker />
        <AuctionEndDatePicker />
        <MinBuyAmountPerOrderInput />
        <AtomicClosureAllowedCheckbox />
        <AllowListManagerInput />
        <AllowListDataInput />
        <SubmitForm />
      </Container>
    </FormProvider>
  )
}

export default App
