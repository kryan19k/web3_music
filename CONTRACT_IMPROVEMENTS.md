# Music NFT Marketplace - Contract System Improvements

## 🚨 Critical Fixes Needed for Track-Specific Minting

### 1. Fix MusicNFT Contract (trackcontract.sol)

```solidity
// ADD: Track counter and discovery
uint256 public nextTrackId = 0;
uint256 public totalActiveTracks = 0;
mapping(uint256 => bool) public trackExists;

// MODIFY: addTrack to return trackId and auto-increment
function addTrack(
    string memory title,
    string memory artist,
    string memory album,
    string memory ipfsAudioHash,
    string memory ipfsCoverArt,
    uint256 duration,
    uint256 bpm,
    string memory genre
) external onlyRole(ARTIST_ROLE) returns (uint256 trackId) {
    trackId = nextTrackId++;
    
    tracks[trackId] = Track({
        title: title,
        artist: artist,
        album: album,
        ipfsAudioHash: ipfsAudioHash,
        ipfsCoverArt: ipfsCoverArt,
        ipfsLyrics: "",
        duration: duration,
        bpm: bpm,
        genre: genre,
        releaseDate: block.timestamp,
        totalStreams: 0,
        totalRoyaltiesGenerated: 0,
        active: true,
        collaborators: new address[](0),
        collaboratorShares: new uint256[](0)
    });
    
    trackExists[trackId] = true;
    totalActiveTracks++;
    
    emit TrackAdded(trackId, title, artist, new address[](0));
    return trackId;
}

// ADD: Track-aware minting functions
function mintTrackTier(
    uint256 trackId,
    Tier tier,
    uint256 quantity,
    address referrer
) external payable nonReentrant whenNotPaused mintCooldown validTier(tier) {
    require(trackExists[trackId] && tracks[trackId].active, "Invalid/inactive track");
    require(currentPhase == SalePhase.PUBLIC, "Public sale not active");
    require(quantity > 0 && quantity <= MAX_PER_TX, "Invalid quantity");
    
    TierConfig storage config = tiers[tier];
    require(config.saleActive, "Tier not active");
    require(config.currentSupply + quantity <= config.maxSupply, "Exceeds supply");
    
    uint256 totalPrice = _calculatePrice(tier, quantity);
    require(msg.value >= totalPrice, "Insufficient payment");
    
    _processMint(msg.sender, trackId, tier, quantity, referrer); // Pass trackId!
    
    if (msg.value > totalPrice) {
        (bool success, ) = payable(msg.sender).call{value: msg.value - totalPrice}("");
        require(success, "Refund failed");
    }
}

// FIX: _processMint to use actual trackId
function _processMint(
    address buyer,
    uint256 trackId, // NEW PARAMETER
    Tier tier,
    uint256 quantity,
    address referrer
) private {
    // ... existing logic ...
    
    for (uint256 i = 0; i < quantity; i++) {
        uint256 tokenId = config.startId + config.currentSupply;
        config.currentSupply++;
        
        _mint(buyer, tokenId, 1, "");
        
        // FIX: Associate with correct track
        tokenToTier[tokenId] = tier;
        tokenToTrackId[tokenId] = trackId; // ✅ Use actual trackId!
        
        // ... rest of logic ...
    }
}

// ADD: Track enumeration functions
function getAllActiveTracks() external view returns (uint256[] memory) {
    uint256[] memory activeTracks = new uint256[](totalActiveTracks);
    uint256 count = 0;
    
    for (uint256 i = 0; i < nextTrackId; i++) {
        if (trackExists[i] && tracks[i].active) {
            activeTracks[count] = i;
            count++;
        }
    }
    
    return activeTracks;
}

function getTracksByArtist(address artist) external view returns (uint256[] memory) {
    uint256[] memory artistTracks = new uint256[](nextTrackId);
    uint256 count = 0;
    
    for (uint256 i = 0; i < nextTrackId; i++) {
        if (trackExists[i] && tracks[i].active && hasRole(ARTIST_ROLE, artist)) {
            artistTracks[count] = i;
            count++;
        }
    }
    
    // Resize array
    uint256[] memory result = new uint256[](count);
    for (uint256 i = 0; i < count; i++) {
        result[i] = artistTracks[i];
    }
    
    return result;
}
```

## 🚀 Major System Improvements

### 2. Multi-Artist Support
```solidity
// Track artist ownership
mapping(uint256 => address) public trackArtist;
mapping(address => uint256[]) public artistTracks;

// In addTrack:
trackArtist[trackId] = msg.sender;
artistTracks[msg.sender].push(trackId);
```

### 3. Enhanced Royalty System
```solidity
// Track-specific royalty rates
mapping(uint256 => uint256) public trackRoyaltyRate;
mapping(uint256 => address) public trackRoyaltyRecipient;

function setTrackRoyalty(uint256 trackId, uint256 rate, address recipient) 
    external onlyTrackArtist(trackId) {
    require(rate <= 1000, "Max 10%"); // 10% max royalty
    trackRoyaltyRate[trackId] = rate;
    trackRoyaltyRecipient[trackId] = recipient;
}
```

### 4. Time-Based Releases
```solidity
struct TrackSchedule {
    uint256 publicSaleTime;
    uint256 whitelistTime;
    uint256 endTime;
    bool isScheduled;
}

mapping(uint256 => TrackSchedule) public trackSchedules;

function scheduleTrackRelease(
    uint256 trackId,
    uint256 whitelistTime,
    uint256 publicTime,
    uint256 endTime
) external onlyTrackArtist(trackId) {
    trackSchedules[trackId] = TrackSchedule(publicTime, whitelistTime, endTime, true);
}

modifier trackSaleActive(uint256 trackId) {
    TrackSchedule memory schedule = trackSchedules[trackId];
    if (schedule.isScheduled) {
        require(block.timestamp >= schedule.publicSaleTime, "Sale not started");
        require(schedule.endTime == 0 || block.timestamp <= schedule.endTime, "Sale ended");
    }
    _;
}
```

### 5. Enhanced Metadata Contract
```solidity
// In MusicNFTMetadata.sol - Add richer metadata
function generateEnhancedTokenURI(uint256 tokenId) external view returns (string memory) {
    IMusicNFT.Tier tier = musicNFT.tokenToTier(tokenId);
    IMusicNFT.TierConfig memory config = musicNFT.tiers(tier);
    IMusicNFT.Track memory track = musicNFT.tracks(musicNFT.tokenToTrackId(tokenId));
    
    // Enhanced metadata with marketplace compatibility
    string memory json = string(abi.encodePacked(
        '{"name":"', track.title, ' - ', config.name, '",',
        '"description":"', _generateDescription(track, config), '",',
        '"image":"ipfs://', track.ipfsCoverArt, '",',
        '"animation_url":"ipfs://', track.ipfsAudioHash, '",',
        '"external_url":"', baseExternalURL, tokenId.toString(), '",',
        '"properties":{',
            '"track_id":', musicNFT.tokenToTrackId(tokenId).toString(), ',',
            '"tier":"', config.name, '",',
            '"artist":"', track.artist, '",',
            '"duration_seconds":', track.duration.toString(), ',',
            '"bpm":', track.bpm.toString(), ',',
            '"release_date":', track.releaseDate.toString(), ',',
            '"total_streams":', track.totalStreams.toString(), ',',
            '"edition":', (tokenId - config.startId + 1).toString(), ',',
            '"max_supply":', config.maxSupply.toString(),
        '},',
        '"attributes":', _generateAttributes(track, config, tokenId),
        '}'
    ));
    
    return string(abi.encodePacked(
        "data:application/json;base64,",
        Base64.encode(bytes(json))
    ));
}

// Add marketplace-specific functions
function getTokensByTrack(uint256 trackId) external view returns (uint256[] memory) {
    // Return all token IDs for a specific track
}

function getTrackNFTStats(uint256 trackId) external view returns (
    uint256 totalMinted,
    uint256 totalSupply,
    uint256 uniqueOwners,
    uint256 totalVolume
) {
    // Comprehensive track statistics
}
```

### 6. PAGS Token Integration Improvements
```solidity
// In pags.sol - Add track-specific features

// Track-based staking rewards
mapping(uint256 => uint256) public trackStakingMultiplier;
mapping(address => mapping(uint256 => uint256)) public trackStakes;

function stakeForTrack(uint256 trackId, uint256 amount) external {
    require(amount > 0, "Invalid amount");
    require(IMusicNFT(musicNFTContract).trackExists(trackId), "Invalid track");
    
    _transfer(msg.sender, address(this), amount);
    trackStakes[msg.sender][trackId] += amount;
    
    // Higher rewards for staking on specific tracks
    uint256 multiplier = trackStakingMultiplier[trackId];
    if (multiplier == 0) multiplier = 10000; // 1x default
    
    // Calculate enhanced rewards...
}

// Artist-specific token allocations
mapping(address => uint256) public artistAllocations;

function setArtistAllocation(address artist, uint256 amount) 
    external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(IMusicNFT(musicNFTContract).hasRole(ARTIST_ROLE, artist), "Not an artist");
    artistAllocations[artist] = amount;
}
```

### 7. Advanced Marketplace Features
```solidity
// Secondary market with royalties
struct Listing {
    address seller;
    uint256 price;
    uint256 tokenId;
    uint256 trackId;
    uint256 listingTime;
    bool active;
}

mapping(uint256 => Listing) public listings;
mapping(uint256 => uint256[]) public trackListings;

function listNFT(uint256 tokenId, uint256 price) external {
    require(balanceOf(msg.sender, tokenId) > 0, "Not owner");
    require(price > 0, "Invalid price");
    
    uint256 trackId = tokenToTrackId[tokenId];
    
    listings[tokenId] = Listing({
        seller: msg.sender,
        price: price,
        tokenId: tokenId,
        trackId: trackId,
        listingTime: block.timestamp,
        active: true
    });
    
    trackListings[trackId].push(tokenId);
}

function buyNFT(uint256 tokenId) external payable {
    Listing storage listing = listings[tokenId];
    require(listing.active, "Not listed");
    require(msg.value >= listing.price, "Insufficient payment");
    
    // Calculate royalties
    uint256 trackId = listing.trackId;
    uint256 royaltyRate = trackRoyaltyRate[trackId];
    uint256 royaltyAmount = (listing.price * royaltyRate) / 10000;
    
    // Pay artist royalty
    if (royaltyAmount > 0) {
        (bool success, ) = payable(trackRoyaltyRecipient[trackId]).call{value: royaltyAmount}("");
        require(success, "Royalty payment failed");
    }
    
    // Pay seller
    uint256 sellerAmount = listing.price - royaltyAmount;
    (bool success, ) = payable(listing.seller).call{value: sellerAmount}("");
    require(success, "Seller payment failed");
    
    // Transfer NFT
    safeTransferFrom(listing.seller, msg.sender, tokenId, 1, "");
    
    // Cleanup
    listing.active = false;
}
```

## 🎯 Frontend Integration Improvements

### New Hooks Needed:
```typescript
// Get all tracks
export function useAllTracks() {
  const { data: allTracks } = useQuery({
    queryKey: ['all-tracks'],
    queryFn: async () => {
      const trackIds = await contract.read.getAllActiveTracks()
      return Promise.all(trackIds.map(id => contract.read.getTrackInfo([id])))
    }
  })
}

// Get tracks by artist
export function useArtistTracks(artistAddress: string) {
  // Implementation using getTracksByArtist
}

// Track-specific NFT minting
export function useMintTrackNFT() {
  const { writeContract } = useWriteContract()
  
  return useMutation({
    mutationFn: async ({trackId, tier, quantity}) => {
      return writeContract({
        functionName: 'mintTrackTier',
        args: [trackId, tier, quantity, '0x0']
      })
    }
  })
}
```

## 🏆 Why These Improvements Matter:

1. **Scalable Marketplace** - Multiple artists, unlimited tracks
2. **Proper NFT Association** - Each NFT knows its track
3. **Rich Metadata** - Better discovery and marketplace display
4. **Royalty System** - Artists earn from secondary sales
5. **Time-Based Releases** - Album drops, limited releases
6. **Staking Integration** - Track-specific token utility
7. **Multi-Artist Platform** - True marketplace vs single artist
8. **Gas Optimization** - Batch operations and efficient storage

These changes will transform your platform from a single-artist system into a full-scale music NFT marketplace that can compete with major platforms!
