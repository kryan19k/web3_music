# Music NFT Marketplace Architecture Recommendations

## Current Issue
All NFTs are hardcoded to track ID 0, limiting the marketplace to a single track.

## Recommended Approaches

### Option 1: Track-Specific Minting (Recommended)
Modify the contract to mint NFTs for specific tracks:

```solidity
// Instead of hardcoded 0
tokenToTrackId[tokenId] = trackId; // Use actual track ID

// New minting function
function mintTrackTier(
    uint256 trackId,
    Tier tier,
    uint256 quantity,
    address referrer
) external payable {
    require(tracks[trackId].active, "Track not active");
    // ... rest of minting logic
    tokenToTrackId[tokenId] = trackId; // Associate with correct track
}
```

### Option 2: One Contract Per Artist/Track Collection
- Deploy separate contracts for each artist
- Each contract manages one artist's complete discography
- Better for gas optimization and isolated artist management

### Option 3: Multi-Track Single Contract (Current + Enhanced)
- Keep current structure but fix track association
- Add track ID parameter to mint functions
- Allows multiple tracks in one contract

## For Your Marketplace, I Recommend Option 1:

### Benefits:
✅ **Multiple tracks per contract** - Artists can release full albums
✅ **Proper NFT-track association** - Each NFT knows its track
✅ **Marketplace compatibility** - Can display all tracks/NFTs
✅ **Artist flexibility** - Upload multiple tracks over time
✅ **Scalable** - Supports growing music library

### Implementation:
1. Add `trackId` parameter to mint functions
2. Properly associate `tokenToTrackId[tokenId] = trackId`
3. Update hooks to fetch all track IDs (not just 0)
4. Create track discovery mechanisms

## Smart Contract Changes Needed:

```solidity
// Add track counter
uint256 public nextTrackId = 0;

// Modified addTrack to auto-assign IDs
function addTrack(
    string memory title,
    string memory artist,
    // ... other params
) external onlyRole(ARTIST_ROLE) returns (uint256 trackId) {
    trackId = nextTrackId++;
    
    tracks[trackId] = Track({
        title: title,
        artist: artist,
        // ...
        active: true
    });
    
    return trackId;
}

// Track-aware minting
function mintTrackTier(
    uint256 trackId,
    Tier tier,
    uint256 quantity
) external payable {
    require(tracks[trackId].active, "Track not active");
    
    for (uint256 i = 0; i < quantity; i++) {
        uint256 tokenId = config.startId + config.currentSupply;
        tokenToTrackId[tokenId] = trackId; // ✅ Proper association
        // ... rest of minting
    }
}
```

## Frontend Changes Needed:

```typescript
// Hook to get all tracks
function useAllActiveTracks() {
  // Query tracks 0 through nextTrackId
}

// Hook to get NFTs for specific track
function useTrackNFTs(trackId: number) {
  // Get NFTs associated with trackId
}

// Marketplace displays all track NFTs
function useMarketplaceNFTs() {
  // Combine all tracks' NFTs
}
```

## Migration Strategy:

Since you're early in development:
1. **Update contract** with track-aware minting
2. **Redeploy** with new architecture
3. **Update hooks** to handle multiple tracks  
4. **Test** with multiple track uploads

This will give you a proper foundation for a multi-artist, multi-track marketplace!
