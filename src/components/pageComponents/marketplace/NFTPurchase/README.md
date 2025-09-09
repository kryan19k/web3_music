# NFT Purchase Page

A comprehensive, dedicated NFT purchase page that provides detailed analytics and advanced purchase features for music NFTs.

## Features

### 🎵 **Enhanced Media Experience**
- High-quality album art display with hover effects
- Interactive waveform visualization using WaveSurfer
- Seamless audio playback integration
- Visual audio indicators during playback

### 📊 **Advanced Analytics**
- Market analytics with price/volume history
- Risk analysis with volatility and liquidity metrics
- Earnings projections (conservative & optimistic)
- Real-time market pulse indicators
- Holder statistics and trading metrics

### 💎 **Tier System Integration**
- Bronze, Silver, Gold, and Platinum tiers
- Tier-specific benefits and perks
- Dynamic pricing based on tier and supply
- PAGS token allocation per tier

### 🔐 **Web3 Integration**
- Wallet connection required for purchasing
- Smart contract integration via wagmi hooks
- Transaction processing with loading states
- Error handling and user feedback

### 🎯 **User Experience**
- Responsive design (mobile-first approach)
- Smooth animations with Framer Motion
- Sticky purchase sidebar
- Multiple tabs for different information views
- Advanced/Quick purchase options

## Navigation

Users can access the purchase page through:
1. **NFT Cards**: Click the purchase button on any NFT card
2. **NFT Detail Page**: Click "Advanced Purchase" for detailed analysis
3. **Direct URL**: `/marketplace/purchase/{nftId}`

## Tabs Overview

### Overview
- Track information and description
- Streaming statistics
- Track attributes and metadata

### Analytics
- Market analytics and trends
- Price history visualization
- Earnings projections
- Advanced metrics toggle

### Benefits
- Tier-specific benefits
- Exclusive content access
- Unlock status indicators

### Risk Analysis
- Volatility assessment
- Liquidity metrics
- Investment warnings
- Risk score calculation

### Community
- Social features (coming soon)
- Community sentiment
- Holder interactions

## Purchase Flow

1. **Connect Wallet**: Required for any purchase action
2. **Analysis Phase**: Review all metrics and analytics
3. **Purchase Confirmation**: Smart contract interaction
4. **Processing**: Transaction confirmation
5. **Success**: NFT ownership transfer

## Technical Integration

- **Route**: `src/routes/marketplace/purchase/$nftId.tsx`
- **Component**: `src/components/pageComponents/marketplace/NFTPurchase/index.tsx`
- **Smart Contracts**: `src/hooks/contracts/useMusicNFT.ts`
- **Types**: `src/types/music-nft.ts`

## Mock Data

The page currently uses enhanced mock data with:
- Detailed market analytics
- Risk analysis metrics
- Earnings projections
- Exclusive content information

## Future Enhancements

- Real-time price feeds
- Social features and community integration
- Historical charts and advanced visualizations
- Governance voting for NFT holders
- Referral and affiliate systems
