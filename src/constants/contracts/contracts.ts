import { PAGSTokenAbi } from './abis/PAGSToken'
import { MUSIC_NFT_ABI, MusicNFTAbi } from './abis/MusicNFT'
import { MusicNFTMetadataAbi } from './abis/MusicNFTMetadata'

// Contract addresses per chain - Updated: 2025-09-10T23:41:17.155Z
export const CONTRACT_ADDRESSES = {
  // Polygon Amoy (Testnet) - Current deployment
  80002: {
    PAGSToken: "0xCCfBbca65c129381C367C67EcDC1271B880D1b05" as const,
    MusicNFT: "0x2CC2287C9b72Bf2BDb194DF6Cac265d2BD3B2167" as const,
    MusicNFTMetadata: "0xAD77708c10CF1E1975cB29280Af2139686439bDB" as const,
  },
  
  // Add other chains as you deploy contracts
  // Example:
  // 1: { // Ethereum Mainnet
  //   PAGSToken: "0x..." as const,
  //   MusicNFT: "0x..." as const,
  //   MusicNFTMetadata: "0x..." as const,
  // },
  // 137: { // Polygon Mainnet
  //   PAGSToken: "0x..." as const,
  //   MusicNFT: "0x..." as const,
  //   MusicNFTMetadata: "0x..." as const,
  // },
  
} as const

// Helper function to get all supported chain IDs
export function getSupportedChainIds(): number[] {
  return Object.keys(CONTRACT_ADDRESSES).map(Number)
}

// Helper function to check if contracts are deployed on a specific chain
export function isChainSupported(chainId: number): boolean {
  return chainId in CONTRACT_ADDRESSES
}

// Legacy export for backwards compatibility
export const CONTRACTS = {
  PAGSToken: {
    address: CONTRACT_ADDRESSES[80002].PAGSToken,
    chainId: 80002,
  },
  MusicNFT: {
    address: CONTRACT_ADDRESSES[80002].MusicNFT,
    chainId: 80002,
  },
  MusicNFTMetadata: {
    address: CONTRACT_ADDRESSES[80002].MusicNFTMetadata,
    chainId: 80002,
  },
} as const;

export const NETWORK_INFO = {
  name: "polygonAmoy",
  chainId: 80002,
  rpcUrl: "https://rpc-amoy.polygon.technology/",
  blockExplorer: "https://amoy.polygonscan.com/",
} as const;

// Individual contract address exports for easier importing
export const PAGS_TOKEN_ADDRESS = CONTRACTS.PAGSToken.address;
export const MUSIC_NFT_ADDRESS = CONTRACTS.MusicNFT.address;
export const MUSIC_NFT_METADATA_ADDRESS = CONTRACTS.MusicNFTMetadata.address;

// Contract metadata
export const CONTRACT_METADATA = {
  supportedChainIds: getSupportedChainIds(),
  defaultChainId: 80002,
  network: NETWORK_INFO,
};

// Helper function to get contract address by name and chain
export function getContractAddress(
  contractName: keyof (typeof CONTRACT_ADDRESSES)[keyof typeof CONTRACT_ADDRESSES], 
  chainId: number = 80002
): string {
  const chainContracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  
  if (!chainContracts) {
    throw new Error(`No contracts deployed on chain ${chainId}. Please deploy contracts or switch to a supported network.`)
  }
  
  const address = chainContracts[contractName]
  if (!address) {
    throw new Error(`Contract ${contractName} not found on chain ${chainId}`)
  }
  
  return address
}

// Helper function to get contract addresses for current chain
export function getContractAddresses(chainId: number) {
  const chainContracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  
  if (!chainContracts) {
    throw new Error(`No contracts deployed on chain ${chainId}`)
  }
  
  return chainContracts
}

// Wagmi CLI contracts configuration
export function getContracts() {
  return [
    {
      name: 'PAGSToken',
      address: CONTRACTS.PAGSToken.address,
      abi: PAGSTokenAbi,
    },
    {
      name: 'MusicNFT', 
      address: CONTRACTS.MusicNFT.address,
      abi: MUSIC_NFT_ABI,
    },
    {
      name: 'MusicNFTMetadata',
      address: CONTRACTS.MusicNFTMetadata.address, 
      abi: MusicNFTMetadataAbi,
    },
  ] as const;
}
