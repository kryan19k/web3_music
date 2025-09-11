# Collection-Based Architecture: Albums as Collections

## 🎵 **Core Concept: Collections = Albums, Tracks = Songs**

Instead of standalone tracks, organize music into **Collections (Albums)** containing **Tracks (Songs)**. This mirrors real music industry structure and enables powerful features.

```
Collection (Album) 1: "Midnight Dreams"
├── Track 1: "Starlight"
├── Track 2: "City Nights" 
├── Track 3: "Electric Dreams"
└── Track 4: "Fade Away"

Collection (Album) 2: "Summer Vibes EP"
├── Track 1: "Beach Walk"
├── Track 2: "Sunset Drive"
└── Track 3: "Ocean Breeze"
```

## 🏗️ **Contract Architecture**

### **Collection Structure**
```solidity
struct Collection {
    uint256 collectionId;
    string title;           // Album title
    string artist;          // Artist name
    string description;     // Album description
    string ipfsCoverArt;    // Album cover
    string ipfsMetadata;    // Additional metadata
    uint256 releaseDate;
    string genre;
    uint256[] trackIds;     // Tracks in this collection
    uint256 totalTracks;
    address artist;         // Artist address
    bool isComplete;        // All tracks added
    bool active;
    
    // Album-level economics
    uint256 albumPrice;     // Price for full album
    uint256 albumDiscount;  // Discount vs individual tracks
    uint256 totalSales;
    uint256 totalRoyalties;
}

struct Track {
    uint256 trackId;
    uint256 collectionId;   // Parent album
    string title;
    string ipfsAudioHash;
    string ipfsLyrics;
    uint256 duration;
    uint256 bpm;
    uint256 trackNumber;    // Position in album
    bool isBonus;           // Bonus track
    bool active;
    
    // Track-specific data
    uint256 streams;
    uint256 royaltiesGenerated;
}

// State variables
mapping(uint256 => Collection) public collections;
mapping(uint256 => Track) public tracks;
mapping(uint256 => uint256) public trackToCollection;
mapping(address => uint256[]) public artistCollections;
uint256 public nextCollectionId = 0;
uint256 public nextTrackId = 0;
```

### **Collection Management Functions**
```solidity
// Create new album/collection
function createCollection(
    string memory title,
    string memory description,
    string memory ipfsCoverArt,
    string memory genre,
    uint256 plannedTracks
) external onlyRole(ARTIST_ROLE) returns (uint256 collectionId) {
    collectionId = nextCollectionId++;
    
    collections[collectionId] = Collection({
        collectionId: collectionId,
        title: title,
        artist: msg.sender,
        description: description,
        ipfsCoverArt: ipfsCoverArt,
        genre: genre,
        releaseDate: 0, // Set when completed
        trackIds: new uint256[](0),
        totalTracks: plannedTracks,
        artistAddress: msg.sender,
        isComplete: false,
        active: false,
        albumPrice: 0,
        albumDiscount: 1000, // 10% discount for full album
        totalSales: 0,
        totalRoyalties: 0
    });
    
    artistCollections[msg.sender].push(collectionId);
    emit CollectionCreated(collectionId, title, msg.sender);
    return collectionId;
}

// Add track to collection
function addTrackToCollection(
    uint256 collectionId,
    string memory title,
    string memory ipfsAudioHash,
    uint256 duration,
    uint256 bpm,
    uint256 trackNumber
) external onlyCollectionArtist(collectionId) returns (uint256 trackId) {
    require(collections[collectionId].active || !collections[collectionId].isComplete, 
            "Collection finalized");
    
    trackId = nextTrackId++;
    
    tracks[trackId] = Track({
        trackId: trackId,
        collectionId: collectionId,
        title: title,
        ipfsAudioHash: ipfsAudioHash,
        duration: duration,
        bpm: bpm,
        trackNumber: trackNumber,
        isBonus: false,
        active: true,
        streams: 0,
        royaltiesGenerated: 0
    });
    
    collections[collectionId].trackIds.push(trackId);
    trackToCollection[trackId] = collectionId;
    
    emit TrackAddedToCollection(collectionId, trackId, title);
    return trackId;
}

// Complete and activate collection
function finalizeCollection(uint256 collectionId) 
    external onlyCollectionArtist(collectionId) {
    Collection storage collection = collections[collectionId];
    require(!collection.isComplete, "Already finalized");
    require(collection.trackIds.length > 0, "No tracks added");
    
    collection.isComplete = true;
    collection.active = true;
    collection.releaseDate = block.timestamp;
    
    // Calculate album price (sum of track prices with discount)
    uint256 totalTrackPrice = 0;
    for (uint i = 0; i < collection.trackIds.length; i++) {
        // Sum up all tier prices for this track
        for (uint256 tier = 0; tier <= uint256(Tier.PLATINUM); tier++) {
            totalTrackPrice += tiers[Tier(tier)].price;
        }
    }
    collection.albumPrice = (totalTrackPrice * (10000 - collection.albumDiscount)) / 10000;
    
    emit CollectionFinalized(collectionId, collection.trackIds.length);
}
```

### **Collection-Aware Minting**
```solidity
// Mint single track NFT
function mintTrackNFT(
    uint256 trackId,
    Tier tier,
    uint256 quantity
) external payable {
    uint256 collectionId = trackToCollection[trackId];
    require(collections[collectionId].active, "Collection not active");
    require(tracks[trackId].active, "Track not active");
    
    _processMint(msg.sender, collectionId, trackId, tier, quantity, address(0));
}

// Mint full album (all tracks, one tier)
function mintAlbum(
    uint256 collectionId,
    Tier tier
) external payable {
    Collection memory collection = collections[collectionId];
    require(collection.active && collection.isComplete, "Collection not ready");
    
    // Calculate album discount price
    uint256 albumPrice = collection.albumPrice; // Pre-calculated with discount
    require(msg.value >= albumPrice, "Insufficient payment");
    
    // Mint one NFT for each track in the collection
    for (uint256 i = 0; i < collection.trackIds.length; i++) {
        uint256 trackId = collection.trackIds[i];
        _processMint(msg.sender, collectionId, trackId, tier, 1, address(0));
    }
    
    // Bonus: Grant special "Album Owner" NFT
    _mintAlbumCompleteBonus(msg.sender, collectionId, tier);
}

// Special album completion bonus
function _mintAlbumCompleteBonus(address buyer, uint256 collectionId, Tier tier) private {
    // Mint special bonus NFT for owning complete album
    uint256 bonusTokenId = BONUS_START + collectionId;
    _mint(buyer, bonusTokenId, 1, "");
    
    // Grant enhanced benefits
    emit AlbumCompleted(buyer, collectionId, bonusTokenId);
}
```

## 🎁 **Collection-Specific Features**

### **1. Album Completion Rewards**
```solidity
mapping(address => mapping(uint256 => uint256)) public userCollectionProgress;

function checkCollectionCompletion(address user, uint256 collectionId) 
    external view returns (bool complete, uint256 owned, uint256 total) {
    Collection memory collection = collections[collectionId];
    uint256 ownedTracks = 0;
    
    for (uint256 i = 0; i < collection.trackIds.length; i++) {
        uint256 trackId = collection.trackIds[i];
        // Check if user owns any NFT for this track
        for (uint256 tier = 0; tier <= uint256(Tier.PLATINUM); tier++) {
            TierConfig memory tierConfig = tiers[Tier(tier)];
            for (uint256 j = 0; j < tierConfig.currentSupply; j++) {
                uint256 tokenId = tierConfig.startId + j;
                if (tokenToTrackId[tokenId] == trackId && balanceOf(user, tokenId) > 0) {
                    ownedTracks++;
                    break;
                }
            }
        }
    }
    
    return (ownedTracks == collection.trackIds.length, ownedTracks, collection.trackIds.length);
}
```

### **2. Collection-Based Benefits**
```solidity
struct CollectionBenefits {
    bool hasAlbumAccess;      // Exclusive album content
    bool hasBehindScenes;     // Making-of content
    bool hasEarlyAccess;      // Next album early access
    uint256 concertDiscount;  // Tour discounts
    bool hasVirtualMeet;      // Virtual meet & greet
    uint256 merchDiscount;    // Merchandise discount
}

mapping(uint256 => CollectionBenefits) public collectionBenefits;

function getCollectionBenefits(address holder, uint256 collectionId) 
    external view returns (bool hasAccess, CollectionBenefits memory benefits) {
    (bool complete,,) = checkCollectionCompletion(holder, collectionId);
    if (complete) {
        return (true, collectionBenefits[collectionId]);
    }
    return (false, CollectionBenefits(false, false, false, 0, false, 0));
}
```

### **3. Cross-Track Synergies**
```solidity
// Special benefits for owning multiple tracks from same collection
function getCollectionProgress(address user, uint256 collectionId) 
    external view returns (
        uint256 tracksOwned,
        uint256 totalTracks,
        uint256 completionPercentage,
        string[] memory unlockedBenefits
    ) {
    // Calculate and return progression rewards
}
```

## 🎵 **Marketplace Benefits**

### **Album Discovery**
- Browse by **collections/albums** instead of individual tracks
- **Album-based filtering** (genre, artist, release date)
- **Collection completion status** for users
- **Album artwork** as primary visual

### **Enhanced UX**
- **Play full album** functionality
- **Track progression** within albums
- **Album-based playlists**
- **Artist discography** view

### **Economic Models**
- **Album bundles** at discounted rates
- **Track-by-track** purchasing
- **Collection completion** incentives
- **Cross-album** artist benefits

## 🚀 **Frontend Implementation**

### **New Hook Structure**
```typescript
// Get artist's collections
export function useArtistCollections(artistAddress: string) {
  return useQuery({
    queryKey: ['artist-collections', artistAddress],
    queryFn: async () => {
      const collectionIds = await contract.read.artistCollections([artistAddress])
      return Promise.all(
        collectionIds.map(id => contract.read.collections([id]))
      )
    }
  })
}

// Get collection with tracks
export function useCollection(collectionId: number) {
  return useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const collection = await contract.read.collections([collectionId])
      const tracks = await Promise.all(
        collection.trackIds.map(id => contract.read.tracks([id]))
      )
      return { ...collection, tracks }
    }
  })
}

// User's collection progress
export function useCollectionProgress(collectionId: number) {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['collection-progress', address, collectionId],
    queryFn: async () => {
      return contract.read.checkCollectionCompletion([address, collectionId])
    }
  })
}
```

### **Upload Flow Changes**
```typescript
// 1. Create Collection (Album)
const createCollection = useMutation({
  mutationFn: async (albumData) => {
    return contract.write.createCollection([
      albumData.title,
      albumData.description,
      albumData.coverArt,
      albumData.genre,
      albumData.plannedTracks
    ])
  }
})

// 2. Add Tracks to Collection
const addTrack = useMutation({
  mutationFn: async ({collectionId, trackData}) => {
    return contract.write.addTrackToCollection([
      collectionId,
      trackData.title,
      trackData.audioHash,
      trackData.duration,
      trackData.bpm,
      trackData.trackNumber
    ])
  }
})

// 3. Finalize Album
const finalizeAlbum = useMutation({
  mutationFn: async (collectionId) => {
    return contract.write.finalizeCollection([collectionId])
  }
})
```

## 💎 **Why This Is Superior**

| Feature | Track-Only | **Collection-Based** |
|---------|------------|---------------------|
| Organization | Individual songs | Albums + Songs |
| Discovery | Song search | Album browsing + song search |
| Artist Strategy | Single releases | Album releases + singles |
| User Experience | Fragmented | Cohesive listening experience |
| Economics | Per-track | Album bundles + individual |
| Completion | N/A | Collection rewards |
| Benefits | Per-track only | Album-level + track-level |
| Marketplace | Basic | Rich album ecosystem |

## 🎯 **Implementation Priority**

1. **Core Collection Structure** - Collections + Tracks
2. **Collection-Aware Minting** - Track and album minting
3. **Frontend Album View** - Browse and display albums
4. **Collection Progress** - Track completion status
5. **Album Benefits** - Collection-level rewards
6. **Enhanced Discovery** - Album-based browsing

This architecture transforms your platform from individual track sales into a **full music ecosystem** where artists can release albums, EPs, and singles with rich interconnected experiences!

Want me to start implementing the collection structure in your contracts?
