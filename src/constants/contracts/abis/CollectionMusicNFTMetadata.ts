// Auto-generated ABI for CollectionMusicNFTMetadata contract
// Generated on: 2025-09-11T05:30:57.040Z
// Contract: contracts/CollectionMusicNFTMetadata.sol:CollectionMusicNFTMetadata

export const CollectionMusicNFTMetadataAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_musicNFT",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BONUS_START",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BRONZE_START",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "GOLD_START",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PLATINUM_START",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SILVER_START",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SPECIAL_START",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "baseExternalURL",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collectionExternalURL",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "generateTokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "collectionId",
        "type": "uint256"
      }
    ],
    "name": "getCollectionMetadata",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "collectionId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "artist",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsCoverArt",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsMetadata",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "releaseDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "genre",
            "type": "string"
          },
          {
            "internalType": "uint256[]",
            "name": "trackIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalTracks",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "artistAddress",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isComplete",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "albumPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "albumDiscount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalSales",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalRoyalties",
            "type": "uint256"
          }
        ],
        "internalType": "struct ICollectionMusicNFT.Collection",
        "name": "collection",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "trackId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "collectionId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsAudioHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsLyrics",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bpm",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "trackNumber",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isBonus",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "streams",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royaltiesGenerated",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "collaborators",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "collaboratorShares",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ICollectionMusicNFT.Track[]",
        "name": "tracks",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "totalNFTsMinted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "uniqueHolders",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "holder",
        "type": "address"
      }
    ],
    "name": "getHolderBenefits",
    "outputs": [
      {
        "internalType": "bool",
        "name": "hasAnyNFT",
        "type": "bool"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "hasBackstageAccess",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "hasRemixRights",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "hasStemAccess",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "merchDiscount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "concertPriority",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "hasGovernanceRights",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "hasExclusiveContent",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "maxGuestListSpots",
            "type": "uint256"
          }
        ],
        "internalType": "struct ICollectionMusicNFT.HolderBenefits",
        "name": "benefits",
        "type": "tuple"
      },
      {
        "internalType": "enum ICollectionMusicNFT.Tier",
        "name": "highestTier",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getOwnedCollections",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "collectionIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "completionPercentages",
        "type": "uint256[]"
      },
      {
        "internalType": "bool[]",
        "name": "completedStatus",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getOwnedTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "collectionId",
        "type": "uint256"
      }
    ],
    "name": "getTokensByCollection",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "tokenIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalNFTs",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalSpent",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "blokBalance",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "referralEarnings",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collectionsOwned",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collectionsCompleted",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "musicNFT",
    "outputs": [
      {
        "internalType": "contract ICollectionMusicNFT",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_baseURL",
        "type": "string"
      }
    ],
    "name": "setBaseExternalURL",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_collectionURL",
        "type": "string"
      }
    ],
    "name": "setCollectionExternalURL",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_musicNFT",
        "type": "address"
      }
    ],
    "name": "setMusicNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Alternative export names for backward compatibility
export const MusicNFTMetadataAbi = CollectionMusicNFTMetadataAbi;
