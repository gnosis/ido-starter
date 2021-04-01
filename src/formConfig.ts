export type Auction = {
  auctioningToken: string
  biddingToken: string
  sellAmount: string
  minBuyAmount: string
  minFundingThreshold?: string
  orderCancellationEndDate?: string
  auctionEndDate?: string
  minBuyAmountPerOrder?: string
  isWhiteListingProcessUsed: boolean
  isAtomicClosureAllowed?: boolean
  allowListData?: string
}

export type FormKeys = keyof Auction

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DEFAULT_FORM_PARAMS: Readonly<Record<FormKeys, any>> = {
  auctioningToken: '',
  biddingToken: '',
  sellAmount: '',
  minBuyAmount: '',
  minFundingThreshold: '',
  orderCancellationEndDate: '',
  auctionEndDate: '',
  minBuyAmountPerOrder: '',
  isAtomicClosureAllowed: false,
  isWhiteListingProcessUsed: false,
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
    label: 'Sell Amount',
    tooltipText: 'The amount of auctioning tokens to be sold',
  },
  minBuyAmount: {
    label: 'Minimum Buy Amount',
    tooltipText:
      'The amount of bidding token to be bought at least for the whole sell amount. Together with the upper sell amount, one is specifying the price: Sell-Amount / Min-Buy-Amount',
  },
  minFundingThreshold: {
    label: 'Minimal Funding Threshold',
    tooltipText:
      'The minimal funding threshold for executing the settlement. If funding is not reached, everyone will get back their investment',
  },
  orderCancellationEndDate: {
    label: 'Order Cancellation End Time',
    tooltipText: 'Choose a time (your local time) until users should still able to cancel orders',
  },
  auctionEndDate: {
    label: 'Auction End Time',
    tooltipText: 'Choose a time (your local time) marking the end of the auction.',
  },
  minBuyAmountPerOrder: {
    label: 'Minimal Bidding-Amount Per Order',
    tooltipText:
      'Describes the minimal amount - of bidding tokens - per order in the auction. This can be used in order to protect against too high gas costs for the settlement',
  },
  isAtomicClosureAllowed: {
    label: 'Atomic Closure Allowance',
    tooltipText:
      'Describes whether the auction should be allowed to be closed atomically - i.e. that the last bid can be submitted together with the price. This allows atomic arbitrage and is only recommended for liquid tokens.',
  },
  isWhiteListingProcessUsed: {
    label: 'Do you want to use whitelisting process for your auction?',
    tooltipText: '',
  },
  allowListData: {
    label: 'Signing Address',
    tooltipText:
      'Provide the public key that is used to allow list participants for the auction participation',
  },
}

export const ALLOW_LISTING_CONTRACT = '0x7C882F296335734B958b35DA6b2595FA00043AE9'

// Probably something like that should be used:
// {
//   '4': '0x7C882F296335734B958b35DA6b2595FA00043AE9',
// '1': '0x0F4648d997e486cE06577d6Ee2FecBcA84b834F4',
// '100': 0x0F4648d997e486cE06577d6Ee2FecBcA84b834F4'
// }
