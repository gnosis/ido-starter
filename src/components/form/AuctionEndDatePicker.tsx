import moment from 'moment'
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
            },
          }}
          triggerOnChange="orderCancellationEndDate"
        />
        <IconTooltip tooltipText={FORM_PARAMETERS[formKey].tooltipText} />
      </InputLineContainer>
    </>
  )
}
