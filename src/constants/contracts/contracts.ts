// Contract addresses for polygonAmoy (Chain ID: 80002)
export const CONTRACTS = {
  PAGSToken: {
    address: "0x6aDa86A24f405b3E751ebD00d7734b8ACFB874E2" as const,
    chainId: 80002,
  },
  MusicNFT: {
    address: "0xa8C696FfCBf4F2845250C2b5A99351479e604ecd" as const,
    chainId: 80002,
  },
  MusicNFTMetadata: {
    address: "0xF692DFee5037d3Ca937943638609a9865fa930EE" as const,
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
