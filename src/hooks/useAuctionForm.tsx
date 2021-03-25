import { useForm } from 'react-hook-form'

import { Auction, DEFAULT_FORM_PARAMS } from '../formConfig'

export const useAuctionForm = () => {
  const formMethods = useForm<Required<Auction>>({
    mode: 'all',
    defaultValues: DEFAULT_FORM_PARAMS,
  })

  return formMethods
}
