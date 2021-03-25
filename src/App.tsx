import React from 'react'
import { FormProvider } from 'react-hook-form'

import { Divider, Title } from '@gnosis.pm/safe-react-components'

import { FormContainer } from './components/common/FormContainer'
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
import { useAuctionForm } from './hooks/useAuctionForm'

const App: React.FC = () => {
  const formMethods = useAuctionForm()

  return (
    <FormProvider {...formMethods}>
      <FormContainer>
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
      </FormContainer>
    </FormProvider>
  )
}

export default App
