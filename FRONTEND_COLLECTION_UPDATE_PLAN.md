# 🎵 Frontend Collection-Based Architecture Update Plan

## 📋 **Overview**
Transform the frontend from a single-track model to a collection-based architecture where Collections = Albums and Tracks = Songs, with album completion mechanics and enhanced user experience.

---

## 🎯 **Critical Changes Required**

### 1. **CONTRACT & HOOKS LAYER** 🔧

#### **A. Update Contract References**
- ✅ **COMPLETED**: New contracts deployed with collection architecture
- 🔄 **UPDATE REQUIRED**: All import statements and addresses

**Files to Update:**
```
src/constants/contracts/contracts.ts           ✅ COMPLETED - New addresses exported
src/constants/contracts/abis/                  ✅ COMPLETED - New ABIs available
├── BLOKToken.ts                               ✅ NEW CONTRACT
├── CollectionMusicNFT.ts                     ✅ NEW CONTRACT  
├── CollectionMusicNFTMetadata.ts             ✅ NEW CONTRACT
└── [OLD FILES TO DEPRECATE]
    ├── PAGSToken.ts                           🗑️ LEGACY (aliased to BLOK)
    ├── MusicNFT.ts                            🗑️ LEGACY (aliased to Collection)
    └── MusicNFTMetadata.ts                    🗑️ LEGACY
```

#### **B. Replace Hook Files** 
**HIGH PRIORITY - BLOCKING DEPLOYMENT**

| File | Status | Action Required |
|------|--------|-----------------|
| `src/hooks/contracts/usePAGSToken.ts` | 🔄 **NEEDS UPDATE** | Rename to `useBLOKToken.ts`, update all references |
| `src/hooks/contracts/useMusicNFT.ts` | 🔄 **NEEDS MAJOR UPDATE** | Transform to `useCollectionMusicNFT.ts` with collection logic |
| `src/hooks/contracts/useMusicNFTTracks.ts` | 🔄 **NEEDS REWRITE** | Update for collection-track relationship |

#### **C. New Hook Requirements**
**NEW FUNCTIONALITY NEEDED:**

```typescript
// NEW HOOKS TO CREATE:
src/hooks/contracts/
├── useCollections.ts                    🆕 Collection CRUD operations
├── useCollectionProgress.ts             🆕 Album completion tracking
├── useCollectionMinting.ts             🆕 Individual track + album minting
└── useCollectionDiscovery.ts           🆕 Browse/search collections
```

---

### 2. **ARTIST UPLOAD WORKFLOW** 🎨

#### **A. Current Track Upload (MAJOR OVERHAUL NEEDED)**

**Current Files Requiring Updates:**
```
src/components/artist/
├── TrackUpload/TrackUploadModal.tsx         🔄 TRANSFORM TO COLLECTION
├── ArtistSignupFlow/                        🔄 ADD COLLECTION STEPS  
│   ├── steps/FirstTrackStep.tsx             🔄 INTEGRATE WITH COLLECTIONS
│   └── components/TrackUploadForm.tsx       🔄 ADD COLLECTION CONTEXT
└── FileUpload.tsx                           ✅ CAN REUSE

src/components/pageComponents/artist/Upload/
└── index.tsx                                🔄 MAJOR REWRITE NEEDED
```

#### **B. New Collection Management UI (TO CREATE)**

**NEW COMPONENTS NEEDED:**
```typescript
src/components/artist/Collections/
├── CollectionCreator.tsx               🆕 Create new albums
├── CollectionManager.tsx               🆕 Manage existing albums  
├── TrackToCollectionAssigner.tsx       🆕 Add songs to albums
├── CollectionFinalizer.tsx             🆕 Finalize albums for sale
└── CollectionPreview.tsx               🆕 Preview album before minting

src/components/artist/Dashboard/
├── CollectionStats.tsx                 🆕 Album performance metrics
├── CollectionList.tsx                  🆕 List all artist's albums
└── TrackInventory.tsx                  🆕 Unassigned track management
```

---

### 3. **USER EXPERIENCE & MARKETPLACE** 🛍️

#### **A. Collection Discovery & Browsing**

**New User-Facing Features:**
```typescript
src/components/marketplace/
├── CollectionBrowser.tsx               🆕 Browse albums by artist/genre
├── CollectionDetail.tsx                🆕 Album detail with track list
├── AlbumProgress.tsx                   🆕 Show completion % for users
├── CompletionBadges.tsx                🆕 Show album completion achievements
└── CollectionRecommendations.tsx       🆕 Suggest albums based on ownership

src/components/nft/
├── AlbumNFTCard.tsx                    🆕 Album view with track preview
├── TrackNFTCard.tsx                    🔄 UPDATE for collection context
├── CollectionProgressCard.tsx          🆕 Show user's album completion
└── AlbumMintingModal.tsx               🆕 Mint entire album vs individual tracks
```

#### **B. Enhanced Purchase Experience**

**Minting Flow Updates:**
```typescript
src/components/nft/PurchaseModal.tsx         🔄 ADD ALBUM vs TRACK OPTIONS
├── IndividualTrackMint.tsx             🆕 Mint single song  
├── AlbumMint.tsx                       🆕 Mint complete album (discounted)
├── ProgressTracker.tsx                 🆕 Show album completion progress
└── CompletionBonus.tsx                 🆕 Show bonus for completing album
```

---

### 4. **DASHBOARD & ANALYTICS** 📊

#### **A. Artist Dashboard Updates**

**Files Requiring Major Updates:**
```
src/components/pageComponents/artist/Dashboard/
└── index.tsx                                🔄 ADD COLLECTION ANALYTICS

ADDITIONS NEEDED:
├── CollectionMetrics.tsx               🆕 Album performance stats
├── CompletionRates.tsx                 🆕 Track completion rates by album
├── RevenueByCollection.tsx             🆕 Revenue breakdown per album
└── TopCompletedAlbums.tsx              🆕 Most completed albums ranking
```

#### **B. User Profile Updates**

**User Collection Management:**
```typescript
src/components/profile/
├── CollectionGallery.tsx               🆕 Show owned albums with progress
├── CompletionAchievements.tsx          🆕 Album completion badges
├── FavoriteCollections.tsx             🆕 Curated album preferences
└── CollectionWishlist.tsx              🆕 Albums user wants to complete

src/components/pageComponents/profile/UserProfile/
└── index.tsx                                🔄 INTEGRATE COLLECTION VIEW
```

---

### 5. **NAVIGATION & DISCOVERY** 🧭

#### **A. Updated Navigation Structure**

**Files Requiring Updates:**
```
src/components/layout/Navbar.tsx             🔄 ADD COLLECTIONS MENU
src/routes/                                  🔄 ADD COLLECTION ROUTES
├── collections.tsx                     🆕 Collection browse page
├── collection.$id.tsx                  🆕 Individual collection detail
├── artist.$address.collections.tsx     🆕 Artist's discography  
└── user.collections.tsx               🆕 User's collection library
```

#### **B. Search & Filter Enhancements**

**Enhanced Discovery:**
```typescript
src/components/search/
├── CollectionSearch.tsx                🆕 Search albums by title/artist
├── CollectionFilters.tsx               🆕 Filter by genre/completion/price
├── ArtistDiscography.tsx               🆕 Browse artist's full discography
└── TrendingCollections.tsx             🆕 Hot/trending albums
```

---

### 6. **STAKING & REWARDS** 💰

#### **A. Enhanced Staking with Collection Multipliers**

**Token Integration Updates:**
```typescript
src/components/pageComponents/pags/
└── index.tsx                                🔄 UPDATE TO BLOK TOKEN

ADDITIONS NEEDED:
├── CollectionStaking.tsx               🆕 Stake specific to owned albums
├── StakingMultipliers.tsx              🆕 Show collection completion bonuses
├── RewardCalculator.tsx                🆕 Calculate rewards based on albums owned
└── CollectionBonuses.tsx               🆕 Display album-specific staking bonuses
```

---

## 🛠️ **Implementation Priority & Timeline**

### **PHASE 1: CRITICAL FOUNDATION** (Week 1)
🚨 **BLOCKING - MUST COMPLETE FIRST**

1. **Update Contract Hooks** (Day 1-2) ✅ **COMPLETED**
   - [x] Rename `usePAGSToken.ts` → `useBLOKToken.ts`
   - [x] Update all import references to new contract addresses
   - [x] Transform `useMusicNFT.ts` → `useCollectionMusicNFT.ts`
   - [x] Add collection-specific functions (createCollection, addTrack, etc.)

2. **Fix Artist Upload** (Day 3-4) ✅ **COMPLETED**
   - [x] Update `TrackUploadModal.tsx` to create collections first
   - [x] Modify upload flow: Create Album → Add Tracks → Finalize
   - [x] Test track-to-collection assignment

3. **Basic Collection Display** (Day 5) ✅ **COMPLETED**
   - [x] Create simple `CollectionList.tsx` component  
   - [x] Update artist dashboard to show collections instead of just tracks
   - [x] Ensure existing track uploads work in collection context

### **PHASE 2: ENHANCED USER EXPERIENCE** (Week 2)
🎨 **USER-FACING IMPROVEMENTS**

1. **Collection Browsing** (Day 1-3) ✅ **COMPLETED**
   - [x] Integrated collection browsing directly into marketplace
   - [x] Added album detail views with track listings as NFTs
   - [x] Implemented album progress tracking and metrics display

2. **Enhanced Minting** (Day 4-5) ✅ **COMPLETED**
   - [x] Integrated collection-based minting into marketplace
   - [x] Albums display individual tracks as purchasable NFTs
   - [x] Updated purchase flows to work within collection context

### **PHASE 3: ADVANCED FEATURES** (Week 3)
🚀 **ADVANCED FUNCTIONALITY**

1. **Analytics & Insights**
   - [ ] Collection performance metrics
   - [ ] Completion rate tracking
   - [ ] Revenue analysis by album

2. **Social & Discovery Features**
   - [ ] Artist discography pages
   - [ ] Collection recommendations
   - [ ] Social completion achievements

---

## 🗂️ **File-by-File Update Checklist**

### **IMMEDIATE UPDATES REQUIRED:**

#### **Hooks (CRITICAL)** ✅ **COMPLETED**
- [x] `src/hooks/contracts/usePAGSToken.ts` → Update to BLOK token
- [x] `src/hooks/contracts/useMusicNFT.ts` → Rewrite for collections  
- [x] `src/hooks/contracts/useMusicNFTTracks.ts` → Update track-collection relationship

#### **Artist Components (HIGH PRIORITY)** ✅ **COMPLETED**
- [x] `src/components/artist/TrackUpload/TrackUploadModal.tsx` → Collection-first workflow
- [x] `src/components/pageComponents/artist/Upload/index.tsx` → Major rewrite for collections
- [x] `src/components/pageComponents/artist/Dashboard/index.tsx` → Add collection metrics

#### **Marketplace Components (MEDIUM PRIORITY)**
- [ ] `src/components/pageComponents/marketplace/index.tsx` → Collection browsing
- [ ] `src/components/nft/MusicNFTCard.tsx` → Collection context awareness
- [ ] `src/components/nft/PurchaseModal.tsx` → Album vs track minting

#### **Profile & User Components (MEDIUM PRIORITY)**
- [ ] `src/components/pageComponents/profile/UserProfile/index.tsx` → Collection gallery
- [ ] `src/components/pageComponents/pags/index.tsx` → BLOK token integration

#### **Navigation & Routes (LOW PRIORITY)**
- [ ] `src/components/layout/Navbar.tsx` → Collection navigation
- [ ] `src/routes/*` → Add collection-specific routes

---

## 🎯 **Success Criteria**

### **Phase 1 Complete When:**
- [ ] Artists can create albums (collections)
- [ ] Artists can add tracks to albums  
- [ ] Artists can finalize albums for sale
- [ ] Existing functionality continues to work
- [ ] No console errors related to contract calls

### **Phase 2 Complete When:**
- [ ] Users can browse albums on marketplace
- [ ] Users can mint individual tracks OR complete albums
- [ ] Album completion progress is visible
- [ ] Collection bonuses and rewards work

### **Phase 3 Complete When:**
- [ ] Full collection analytics and insights
- [ ] Social features and achievements
- [ ] Advanced discovery and recommendations
- [ ] Mobile-responsive collection experience

---

## 🚨 **Known Breaking Changes & Migration Path**

### **Contract Function Changes:**
```typescript
// OLD (Single Track Model)
useMusicNFTAddTrack()          → useCollectionMusicNFTAddTrackToCollection()
mintTier()                     → mintTrackNFT() or mintAlbum()
getTrackInfo()                 → getTrack() + getCollection()

// NEW (Collection Model) 
createCollection()             → 🆕 NEW FUNCTION
finalizeCollection()           → 🆕 NEW FUNCTION  
getCollectionProgress()        → 🆕 NEW FUNCTION
mintAlbum()                    → 🆕 NEW FUNCTION
```

### **State Management Updates:**
```typescript
// Need to track collection state
interface AppState {
  collections: Collection[]           // 🆕 NEW
  userCollectionProgress: Progress[]  // 🆕 NEW  
  currentCollection?: Collection      // 🆕 NEW
  // ... existing state
}
```

---

## 📝 **Notes for Implementation**

1. **Backward Compatibility**: Old contract addresses are aliased, so existing code won't break immediately
2. **Progressive Enhancement**: Can implement collection features alongside existing track features
3. **Testing Strategy**: Test each phase thoroughly before moving to next phase
4. **Mobile First**: Ensure all new collection UI works well on mobile devices
5. **Performance**: Lazy load collection data and implement proper caching

---

**🎵 Ready to transform the music NFT experience with collection-based architecture! 🚀**
