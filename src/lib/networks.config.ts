// networks.config.ts
/**
 * This file contains the configuration for the networks used in the application.
 *
 * @packageDocumentation
 */
import { http, type Transport } from 'viem'
import { 
  arbitrum, 
  arbitrumSepolia,
  base, 
  baseSepolia,
  bsc, 
  bscTestnet,
  mainnet, 
  optimism, 
  optimismSepolia, 
  polygon, 
  polygonAmoy, 
  sepolia,
  avalanche,
  avalancheFuji,
  fantom,
  fantomTestnet
} from 'viem/chains'

import { includeTestnets } from '@/src/constants/common'
import { env } from '@/src/env'

const devChains = [
  sepolia,           // Ethereum Sepolia
  polygonAmoy,       // Polygon Amoy  
  optimismSepolia,   // Optimism Sepolia
  arbitrumSepolia,   // Arbitrum Sepolia
  baseSepolia,       // Base Sepolia
  bscTestnet,        // BSC Testnet
  avalancheFuji,     // Avalanche Fuji
  fantomTestnet      // Fantom Testnet
] as const

const prodChains = [
  mainnet,           // Ethereum Mainnet
  polygon,           // Polygon Mainnet
  arbitrum,          // Arbitrum One
  optimism,          // Optimism Mainnet
  base,              // Base Mainnet
  bsc,               // BSC Mainnet
  avalanche,         // Avalanche C-Chain
  fantom             // Fantom Opera
] as const
const allChains = [...devChains, ...prodChains] as const
export const chains = includeTestnets ? allChains : prodChains
export type ChainsIds = (typeof chains)[number]['id']

// Debug logging for chain configuration
console.log('🔗 Network Configuration Debug:', {
  includeTestnets,
  selectedChains: chains.map(chain => ({ id: chain.id, name: chain.name })),
  hasPolygonAmoy: allChains.some(chain => chain.id === polygonAmoy.id),
  totalChains: chains.length
})

type RestrictedTransports = Record<ChainsIds, Transport>
export const transports: RestrictedTransports = {
  // Mainnets
  [mainnet.id]: http(env.PUBLIC_RPC_MAINNET),
  [arbitrum.id]: http(env.PUBLIC_RPC_ARBITRUM),
  [optimism.id]: http(env.PUBLIC_RPC_OPTIMISM),
  [polygon.id]: http(env.PUBLIC_RPC_POLYGON),
  [base.id]: http(env.PUBLIC_RPC_BASE || 'https://mainnet.base.org'),
  [bsc.id]: http(env.PUBLIC_RPC_BSC || 'https://bsc-dataseed1.binance.org'),
  [avalanche.id]: http(env.PUBLIC_RPC_AVALANCHE || 'https://api.avax.network/ext/bc/C/rpc'),
  [fantom.id]: http(env.PUBLIC_RPC_FANTOM || 'https://rpc.ftm.tools'),
  
  // Testnets
  [sepolia.id]: http(env.PUBLIC_RPC_SEPOLIA),
  [polygonAmoy.id]: http(env.PUBLIC_RPC_POLYGON_AMOY || 'https://rpc-amoy.polygon.technology/'),
  [optimismSepolia.id]: http(env.PUBLIC_RPC_OPTIMISM_SEPOLIA),
  [arbitrumSepolia.id]: http(env.PUBLIC_RPC_ARBITRUM_SEPOLIA || 'https://sepolia-rollup.arbitrum.io/rpc'),
  [baseSepolia.id]: http(env.PUBLIC_RPC_BASE_SEPOLIA || 'https://sepolia.base.org'),
  [bscTestnet.id]: http(env.PUBLIC_RPC_BSC_TESTNET || 'https://data-seed-prebsc-1-s1.binance.org:8545'),
  [avalancheFuji.id]: http(env.PUBLIC_RPC_AVALANCHE_FUJI || 'https://api.avax-test.network/ext/bc/C/rpc'),
  [fantomTestnet.id]: http(env.PUBLIC_RPC_FANTOM_TESTNET || 'https://rpc.testnet.fantom.network'),
}
