import { ethers } from 'ethers'

export declare type Networks = 1 | 4 | 100 | 137 | 43113 | 43114

const EASY_AUCTION_MAINNET_ADDRESS = process.env.REACT_APP_EASY_AUCTION_MAINNET_ADDRESS || ''
const EASY_AUCTION_RINKEBY_ADDRESS = process.env.REACT_APP_EASY_AUCTION_RINKEBY_ADDRESS || ''
const EASY_AUCTION_XDAI_ADDRESS = process.env.REACT_APP_EASY_AUCTION_XDAI_ADDRESS || ''
const EASY_AUCTION_POLYGON_ADDRESS = process.env.REACT_APP_EASY_AUCTION_POLYGON_ADDRESS || ''
const EASY_AUCTION_AVALANCHE_MAINNET_ADDRESS =
  process.env.REACT_APP_EASY_AUCTION_AVALANCHE_MAINNET_ADDRESS || ''
const EASY_AUCTION_FUJI_ADDRESS = process.env.REACT_APP_EASY_AUCTION_FUJI_ADDRESS || ''

type EasyAuctionAdresses = { [k in Networks]: string }

export const EASY_AUCTION_ADDRESSES: EasyAuctionAdresses = {
  1: EASY_AUCTION_MAINNET_ADDRESS,
  4: EASY_AUCTION_RINKEBY_ADDRESS,
  100: EASY_AUCTION_XDAI_ADDRESS,
  137: EASY_AUCTION_POLYGON_ADDRESS,
  43113: EASY_AUCTION_FUJI_ADDRESS,
  43114: EASY_AUCTION_AVALANCHE_MAINNET_ADDRESS,
}

const INFURA_ID = process.env.REACT_APP_INFURA_ID
if (!INFURA_ID) {
  throw new Error('REACT_APP_INFURA_ID not provided')
}

const XDAI_RPC = process.env.REACT_APP_XDAI_RPC || 'https://rpc.xdaichain.com'
const POLYGON_RPC = process.env.REACT_APP_POLYGON_RPC || 'https://polygon-rpc.com'
const AVALANCHE_MAINNET_RPC =
  process.env.REACT_APP_AVALANCHE_MAINNET_RPC || 'https://api.avax.network/ext/bc/C/rpc'
const FUJI_RPC = process.env.REACT_APP_FUJI_RPC || 'https://api.avax-test.network/ext/bc/C/rpc'

export const getProvider = (network: number) => {
  const rpc =
    network === 43114
      ? AVALANCHE_MAINNET_RPC
      : network === 43113
      ? FUJI_RPC
      : network === 137
      ? POLYGON_RPC
      : network === 100
      ? XDAI_RPC
      : network === 4
      ? `https://rinkeby.infura.io/v3/${INFURA_ID}`
      : `https://mainnet.infura.io/v3/${INFURA_ID}`
  return new ethers.providers.JsonRpcProvider(rpc)
}
