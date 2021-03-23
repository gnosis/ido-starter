import React from 'react'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { DateTimePicker } from '../common/DateTimePicker'
import { IconTooltip } from '../common/IconTooltip'
import { InputLineContainer } from '../common/InputLineContainer'

export const AuctionEndDatePicker = () => {
  const formKey: FormKeys = 'auctionEndDate'

  return (
    <>
      <InputLineContainer>
        <DateTimePicker label={FORM_PARAMETERS[formKey].label} name={formKey} />
        <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
      </InputLineContainer>
    </>
  )
}
