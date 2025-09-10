import { PAGSTokenAbi } from './abis/PAGSToken'
import { MUSIC_NFT_ABI, MusicNFTAbi } from './abis/MusicNFT'
import { MusicNFTMetadataAbi } from './abis/MusicNFTMetadata'

// Contract addresses for polygonAmoy (Chain ID: 80002) - Updated with fresh deployment
export const CONTRACTS = {
  PAGSToken: {
    address: "0xCCfBbca65c129381C367C67EcDC1271B880D1b05" as const,
    chainId: 80002,
  },
  MusicNFT: {
    address: "0x2CC2287C9b72Bf2BDb194DF6Cac265d2BD3B2167" as const,
    chainId: 80002,
  },
  MusicNFTMetadata: {
    address: "0xAD77708c10CF1E1975cB29280Af2139686439bDB" as const,
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
export const CONTRACT_ADDRESSES = CONTRACTS;
export const CONTRACT_METADATA = {
  supportedChainIds: [80002],
  defaultChainId: 80002,
  network: NETWORK_INFO,
};

// Helper function to get contract address by name and chain
export function getContractAddress(contractName: keyof typeof CONTRACTS, chainId: number = 80002) {
  const contract = CONTRACTS[contractName];
  if (contract.chainId !== chainId) {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`);
  }
  return contract.address;
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
