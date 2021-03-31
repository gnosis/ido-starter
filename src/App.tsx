import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Divider, Title } from '@gnosis.pm/safe-react-components'

import { FormContainer } from './components/common/FormContainer'
import { AllowListDataInput } from './components/form/AllowListDataInput'
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

const App: React.FC = () => {
  const formMethods = useForm<Required<Auction>>({
    mode: 'all',
    defaultValues: DEFAULT_FORM_PARAMS,
  })

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
        <AllowListDataInput />
        <SubmitForm />
      </FormContainer>
    </FormProvider>
  )
}

export default App
