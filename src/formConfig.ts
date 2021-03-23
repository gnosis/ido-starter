export type Auction = {
  auctioningToken: string
  biddingToken: string
  sellAmount: string
  minBuyAmount: string
  minFundingThreshold?: string
  orderCancellationEndDate?: string
  auctionEndDate?: string
  minBuyAmountPerOrder?: string
  isAtomicClosureAllowed?: boolean
  allowListManager?: string
  allowListData?: string
}

export type FormKeys = keyof Auction

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DEFAULT_FORM_PARAMS: Readonly<Record<FormKeys, any>> = {
  auctioningToken: '',
  biddingToken: '',
  sellAmount: '0',
  minBuyAmount: '0',
  minFundingThreshold: '0',
  orderCancellationEndDate: '',
  auctionEndDate: '',
  minBuyAmountPerOrder: '0.01',
  isAtomicClosureAllowed: true,
  allowListManager: '',
  allowListData: '',
}

type FormValues = {
  label: string
  tooltipText: string
}
export const FORM_PARAMETERS: Readonly<Record<FormKeys, FormValues>> = {
  auctioningToken: {
    label: 'Auctioning Token',
    tooltipText: "The ERC20's address of the token that should be sold",
  },
  biddingToken: {
    label: 'Bidding Token',
    tooltipText: "The ERC20's address of the token that should be bought",
  },
  sellAmount: {
    label: 'Number of tokens to auction off',
    tooltipText: 'The amount of auctioning tokens to be sold in atoms',
  },
  minBuyAmount: {
    label: 'Minimum number of tokens to receive in total',
    tooltipText:
      'The amount of bidding token to be bought at least for selling the amount to sell in atoms',
  },
  minFundingThreshold: {
    label: 'Minimal Funding for executing the settlement',
    tooltipText:
      'The minimal funding threshold for executing the settlement. If funding is not reached, everyone will get back their investment',
  },
  orderCancellationEndDate: {
    label: 'End time for order cancellation',
    tooltipText: 'Choose a time (local) until users are still able to cancel orders',
  },
  auctionEndDate: {
    label: 'Auction end time',
    tooltipText: 'Choose a time (local) marking the end of the auction.',
  },
  minBuyAmountPerOrder: {
    label: 'Minimal amount to buy per order placed in the auction',
    tooltipText:
      'Describes the minimal amount to buy per order placed in the auction. This can be used in order to protect against too high gas costs for the settlement',
  },
  isAtomicClosureAllowed: {
    label: 'Is allowed to be closed atomically',
    tooltipText: 'Describes whether the auction should be allowed to be closed atomically',
  },
  allowListManager: {
    label: 'AllowList Contract (Optional)',
    tooltipText:
      'Contract address for a potential List Manager contract, if allow listing is wanted for the started auction',
  },
  allowListData: {
    label: 'Signer (Optional)',
    tooltipText: 'Provide data that is needed for the List Manager',
  },
}
