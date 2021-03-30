import { ethers } from 'ethers'

import { Networks } from '@gnosis.pm/safe-apps-sdk'

const EASY_AUCTION_MAINNET_ADDRESS = process.env.REACT_APP_EASY_AUCTION_MAINNET_ADDRESS || ''
const EASY_AUCTION_RINKEBY_ADDRESS = process.env.REACT_APP_EASY_AUCTION_RINKEBY_ADDRESS || ''
const EASY_AUCTION_XDAI_ADDRESS = process.env.REACT_APP_EASY_AUCTION_XDAI_ADDRESS || ''

type EasyAuctionAdresses = { [k in Networks]: string }

export const EASY_AUCTION_ADDRESSES: EasyAuctionAdresses = {
  MAINNET: EASY_AUCTION_MAINNET_ADDRESS,
  RINKEBY: EASY_AUCTION_RINKEBY_ADDRESS,
  XDAI: EASY_AUCTION_XDAI_ADDRESS,
  MORDEN: '',
  ROPSTEN: '',
  GOERLI: '',
  UNKNOWN: '',
  KOVAN: '',
  ENERGY_WEB_CHAIN: '',
  VOLTA: '',
}

const INFURA_ID = process.env.REACT_APP_INFURA_ID
if (!INFURA_ID) {
  throw new Error('REACT_APP_INFURA_ID not provided')
}

const XDAI_RPC = process.env.REACT_APP_XDAI_RPC || 'https://rpc.xdaichain.com'

export const getProvider = (network: Networks) => {
  const rpc = network === 'XDAI' ? XDAI_RPC : `https://${network}.infura.io/v3/${INFURA_ID}`
  return new ethers.providers.JsonRpcProvider(rpc)
}
