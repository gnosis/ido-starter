import { useFormContext } from 'react-hook-form'

import { Auction } from '../formConfig'

export const useAuctionForm = () => useFormContext<Auction>()
