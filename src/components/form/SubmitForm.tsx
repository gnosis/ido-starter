import React, { useState } from 'react'

import { Button, Loader } from '@gnosis.pm/safe-react-components'

import { useAuctionForm } from '../../hooks/useAuctionForm'
import { useSubmitAuction } from '../../hooks/useSubmitAuction'

export const SubmitForm = () => {
  const { formState, getValues, reset } = useAuctionForm()
  const { initiateNewAuction } = useSubmitAuction()
  const [submitting, setSubmitting] = useState(false)

  return (
    <Button
      color="primary"
      disabled={(!formState.isValid || formState.isValidating) && !submitting}
      onClick={async () => {
        setSubmitting(true)
        const values = getValues()
        // eslint-disable-next-line no-console
        console.log('Form Values', values)
        try {
          const tx = await initiateNewAuction()
          if (tx) {
            reset()
          }
        } catch (e) {
          console.error('Error at initiate auction', e)
        } finally {
          setSubmitting(false)
        }
      }}
      size="lg"
    >
      {submitting && <Loader size="md" />}
      Build transaction
    </Button>
  )
}
