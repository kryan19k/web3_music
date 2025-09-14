// Current V2 ABIs (using consistent naming for frontend compatibility)
import { BLOKTokenV2Abi as BLOKTokenAbi } from './abis/BLOKTokenV2'
import { CollectionMusicNFTV2Abi as CollectionMusicNFTAbi, COLLECTION_MUSIC_NFT_V2_ABI as COLLECTION_MUSIC_NFT_ABI } from './abis/CollectionMusicNFTV2'
import { GrowthStakingAbi } from './abis/GrowthStaking'

// Legacy V1 aliases for backward compatibility
import { PAGSTokenAbi } from './abis/BLOKToken'
import { MusicNFTAbi, MUSIC_NFT_ABI } from './abis/CollectionMusicNFT'
import { CollectionMusicNFTMetadataAbi, MusicNFTMetadataAbi } from './abis/CollectionMusicNFTMetadata'

// Contract addresses per chain - Updated: 2025-09-12T${new Date().toISOString().split('T')[1]}
export const CONTRACT_ADDRESSES = {
  // Polygon Amoy (Testnet) - V2 Collection-based deployment
  80002: {
    // Using consistent names for frontend compatibility (pointing to V2 contracts)
    BLOKToken: "0xDdA792A288ed8560c06afadEbD665F4A5Bf61E0D" as const,
    CollectionMusicNFT: "0x52eA56B713A7334B10C6936346618501C597C0e7" as const,
    GrowthStaking: "0x426f6EFd6ef26da67D4EF65D1392e6284cAa4098" as const,
    
    // Legacy aliases for backward compatibility
    PAGSToken: "0xDdA792A288ed8560c06afadEbD665F4A5Bf61E0D" as const,
    MusicNFT: "0x52eA56B713A7334B10C6936346618501C597C0e7" as const,
    
    // V1 Legacy contracts (deprecated - old addresses kept for reference)
    BLOKTokenV1: "0x4a918D667Fab0Ef3F9FFec0D4b1dd4a3855E5301" as const,
    CollectionMusicNFTV1: "0x23E685A3EDcfc1d194075B5eaaD76Ea2Bfd195fC" as const,
    CollectionMusicNFTMetadata: "0x65b230B91614130e6e708802026a67fA607Bf3F7" as const,
    MusicNFTMetadata: "0x65b230B91614130e6e708802026a67fA607Bf3F7" as const,
  },
  
  // Add other chains as you deploy contracts
  // Example:
  // 1: { // Ethereum Mainnet
  //   BLOKToken: "0x..." as const,
  //   CollectionMusicNFT: "0x..." as const,
  //   CollectionMusicNFTMetadata: "0x..." as const,
  // },
  // 137: { // Polygon Mainnet
  //   BLOKToken: "0x..." as const,
  //   CollectionMusicNFT: "0x..." as const,
  //   CollectionMusicNFTMetadata: "0x..." as const,
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

// Current contracts (V2 behind the scenes, consistent naming for frontend)
export const CONTRACTS = {
  BLOKToken: {
    address: CONTRACT_ADDRESSES[80002].BLOKToken,
    chainId: 80002,
  },
  CollectionMusicNFT: {
    address: CONTRACT_ADDRESSES[80002].CollectionMusicNFT,
    chainId: 80002,
  },
  GrowthStaking: {
    address: CONTRACT_ADDRESSES[80002].GrowthStaking,
    chainId: 80002,
  },
} as const;

// Legacy exports for backwards compatibility
export const LEGACY_CONTRACTS = {
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

// Individual contract address exports for easier importing (pointing to V2)
export const BLOK_TOKEN_ADDRESS = CONTRACTS.BLOKToken.address;
export const COLLECTION_MUSIC_NFT_ADDRESS = CONTRACTS.CollectionMusicNFT.address;
export const GROWTH_STAKING_ADDRESS = CONTRACTS.GrowthStaking.address;

// Legacy address exports for backward compatibility  
export const PAGS_TOKEN_ADDRESS = BLOK_TOKEN_ADDRESS;
export const MUSIC_NFT_ADDRESS = COLLECTION_MUSIC_NFT_ADDRESS;
export const MUSIC_NFT_METADATA_ADDRESS = COLLECTION_MUSIC_NFT_ADDRESS;

// Contract metadata
export const CONTRACT_METADATA = {
  supportedChainIds: getSupportedChainIds(),
  defaultChainId: 80002,
  network: NETWORK_INFO,
  architecture: 'collection-based',
  features: [
    'Collections (Albums) containing Tracks (Songs)',
    'Album completion mechanics with bonus NFTs',
    'Collection-specific staking multipliers',
    'Multi-artist marketplace support',
    'Enhanced metadata with collection context',
    'Cross-track synergies and benefits'
  ]
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

// Wagmi CLI contracts configuration for V2 collection-based architecture
export function getContracts() {
  return [
    {
      name: 'BLOKToken',
      address: CONTRACTS.BLOKToken.address,
      abi: BLOKTokenAbi,
    },
    {
      name: 'CollectionMusicNFT', 
      address: CONTRACTS.CollectionMusicNFT.address,
      abi: COLLECTION_MUSIC_NFT_ABI,
    },
    {
      name: 'GrowthStaking',
      address: CONTRACTS.GrowthStaking.address, 
      abi: GrowthStakingAbi,
    },
  ] as const;
}

// Legacy Wagmi CLI configuration
export function getLegacyContracts() {
  return [
    {
      name: 'PAGSToken',
      address: LEGACY_CONTRACTS.PAGSToken.address,
      abi: PAGSTokenAbi,
    },
    {
      name: 'MusicNFT', 
      address: LEGACY_CONTRACTS.MusicNFT.address,
      abi: MUSIC_NFT_ABI,
    },
    {
      name: 'MusicNFTMetadata',
      address: LEGACY_CONTRACTS.MusicNFTMetadata.address, 
      abi: MusicNFTMetadataAbi,
    },
  ] as const;
}
