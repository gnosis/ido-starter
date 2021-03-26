import moment from 'moment'
import React from 'react'

import { FORM_PARAMETERS, FormKeys } from '../../formConfig'
import { useAuctionForm } from '../../hooks/useAuctionForm'
import { DateTimePicker } from '../common/DateTimePicker'
import { IconTooltip } from '../common/IconTooltip'
import { InputLineContainer } from '../common/InputLineContainer'

export const OrderCancellationEndDatePicker = () => {
  const formKey: FormKeys = 'orderCancellationEndDate'
  const { getValues } = useAuctionForm()

  return (
    <InputLineContainer>
      <DateTimePicker
        label={FORM_PARAMETERS[formKey].label}
        name={formKey}
        rules={{
          required: { value: true, message: 'Field is required' },
          validate: {
            future: (value) => {
              const now = moment().seconds(0).milliseconds(0)
              if (moment(value).isBefore(now)) {
                return 'Order cancellation End Date should be in the future'
              }
              return true
            },
            beforeAuctionEndDate: (value) => {
              const { auctionEndDate } = getValues()
              if (moment(value).isAfter(moment(auctionEndDate))) {
                return 'Order cancellation End Date should be before auction End Date'
              }

              return true
            },
          },
        }}
      />
      <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
    </InputLineContainer>
  )
}
