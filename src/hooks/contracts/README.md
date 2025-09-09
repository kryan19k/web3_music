# PAGS Music Platform - Contract Integration Hooks

This directory contains comprehensive React hooks for integrating with the PAGS Token and Music NFT smart contracts.

## 📁 File Structure

```
src/hooks/contracts/
├── usePAGSToken.ts          # PAGS token contract hooks
├── useMusicNFT.ts           # Music NFT contract hooks  
├── useContractUtils.ts      # Utility hooks and calculations
├── index.ts                 # Main exports
└── README.md               # This documentation
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm add @tanstack/react-query wagmi viem react-hot-toast
```

### 2. Update Contract Addresses

Edit the contract addresses in your constants file:

```typescript
// src/constants/contracts/abis/PAGSToken.ts
export const PAGS_TOKEN_ADDRESS = '0x...' // Your deployed PAGS token address

// src/constants/contracts/abis/MusicNFT.ts  
export const MUSIC_NFT_ADDRESS = '0x...'  // Your deployed Music NFT address
```

### 3. Basic Usage

```typescript
import { usePAGSUserData, useMusicNFTUserData } from '@/src/hooks/contracts'

function MyComponent() {
  const pagsData = usePAGSUserData()
  const nftData = useMusicNFTUserData()
  
  if (pagsData.isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h2>PAGS Balance: {pagsData.balance}</h2>
      <h2>NFTs Owned: {nftData.ownedTokens?.length || 0}</h2>
      <h2>Pending Royalties: {pagsData.royalties.pendingRoyalties} ETH</h2>
    </div>
  )
}
```

## 🎯 Hook Categories

### 1. PAGS Token Hooks

#### Read Hooks (Data Fetching)
- `usePAGSBalance(address)` - Get token balance for an address
- `usePAGSTotalSupply()` - Get total token supply
- `usePAGSCirculatingSupply()` - Get circulating supply
- `usePAGSRoyaltyInfo(address)` - Get royalty information
- `usePAGSStakingInfo(address)` - Get staking data
- `usePAGSStakingTiers()` - Get available staking tiers

#### Write Hooks (Transactions)
- `usePAGSStake()` - Stake tokens
- `usePAGSUnstake()` - Unstake tokens
- `usePAGSClaimStakingRewards()` - Claim staking rewards
- `usePAGSClaimRoyalties()` - Claim royalty distributions
- `usePAGSDepositRoyalties()` - Deposit royalties (admin)

#### Governance Hooks
- `usePAGSProposals()` - Get all proposals
- `usePAGSCreateProposal()` - Create new proposal
- `usePAGSVote()` - Vote on proposals

### 2. Music NFT Hooks

#### Read Hooks
- `useMusicNFTAllTiers()` - Get all tier configurations
- `useMusicNFTUserData()` - Get user's NFT data
- `useMusicNFTOwnedTokens(address)` - Get owned tokens
- `useMusicNFTHolderBenefits(address)` - Get holder benefits
- `useMusicNFTTrackInfo(trackId)` - Get track metadata

#### Write Hooks  
- `useMusicNFTMint()` - Mint NFTs (public sale)
- `useMusicNFTWhitelistMint()` - Mint with whitelist
- `useMusicNFTSignatureMint()` - Mint with signature
- `useMusicNFTAddTrack()` - Add new track (artist)
- `useMusicNFTClaimCollaboratorRoyalties()` - Claim collaboration royalties

### 3. Utility Hooks

#### Dashboard & Analytics
- `useUserDashboard()` - Complete user overview
- `usePortfolioAnalytics()` - Portfolio performance metrics  
- `useMarketplaceAnalytics()` - Market insights
- `useEarningsCalculator()` - Calculate projections

#### Additional Utilities
- `useTransactionHistory()` - User transaction history
- `useLeaderboard()` - Platform leaderboard
- `useNotifications()` - User notifications

## 💡 Usage Examples

### Staking Tokens

```typescript
import { usePAGSStake, usePAGSStakingTiers } from '@/src/hooks/contracts'

function StakingComponent() {
  const { stake, isLoading } = usePAGSStake()
  const { tiers } = usePAGSStakingTiers()
  
  const handleStake = () => {
    stake({
      amount: '1000', // 1000 PAGS
      tier: 2,        // 90-day tier
      autoCompound: true
    })
  }
  
  return (
    <div>
      <h3>Available Tiers:</h3>
      {tiers.map(tier => (
        <div key={tier.id}>
          {Math.floor(Number(tier.lockPeriod) / 86400)} days - {Number(tier.baseAPY) / 100}% APY
        </div>
      ))}
      <button onClick={handleStake} disabled={isLoading}>
        {isLoading ? 'Staking...' : 'Stake Tokens'}
      </button>
    </div>
  )
}
```

### Minting NFTs

```typescript
import { useMusicNFTMint, Tier } from '@/src/hooks/contracts'

function MintComponent() {
  const { mint, isLoading } = useMusicNFTMint()
  
  const handleMint = () => {
    mint({
      tier: Tier.GOLD,
      quantity: 1,
      referrer: '0x...' // Optional referrer address
    })
  }
  
  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? 'Minting...' : 'Mint Gold NFT'}
    </button>
  )
}
```

### Portfolio Dashboard

```typescript
import { useUserDashboard, contractUtils } from '@/src/hooks/contracts'

function DashboardComponent() {
  const { data: dashboard, isLoading } = useUserDashboard()
  
  if (isLoading) return <div>Loading dashboard...</div>
  
  return (
    <div>
      <h2>Portfolio Value: {contractUtils.formatCurrency(dashboard.totalPortfolioValue)}</h2>
      <h3>PAGS Balance: {contractUtils.formatTokenAmount(dashboard.pagsBalance)}</h3>
      <h3>NFTs Owned: {dashboard.ownedNFTs}</h3>
      <h3>Total Earnings: {contractUtils.formatCurrency(dashboard.totalEarnings)}</h3>
      
      <h4>Earnings Breakdown:</h4>
      <ul>
        <li>Royalties: {contractUtils.formatCurrency(dashboard.royaltyEarnings)}</li>
        <li>Staking: {contractUtils.formatCurrency(dashboard.stakingEarnings)}</li>
        <li>Collaboration: {contractUtils.formatCurrency(dashboard.collaboratorEarnings)}</li>
      </ul>
    </div>
  )
}
```

### Claiming Royalties

```typescript
import { usePAGSClaimRoyalties, usePAGSRoyaltyInfo } from '@/src/hooks/contracts'

function RoyaltyComponent({ address }) {
  const { claimRoyalties, isLoading } = usePAGSClaimRoyalties()
  const royaltyInfo = usePAGSRoyaltyInfo(address)
  
  const hasRoyalties = parseFloat(royaltyInfo.pendingRoyalties) > 0
  
  return (
    <div>
      <h3>Pending Royalties: {royaltyInfo.pendingRoyalties} ETH</h3>
      <p>From {royaltyInfo.unclaimedPeriods} unclaimed periods</p>
      
      <button 
        onClick={() => claimRoyalties()} 
        disabled={isLoading || !hasRoyalties}
      >
        {isLoading ? 'Claiming...' : 'Claim Royalties'}
      </button>
    </div>
  )
}
```

## 🎨 Tier System

The NFT system uses 4 tiers with different benefits:

```typescript
import { Tier, getTierName, getTierColors, contractUtils } from '@/src/hooks/contracts'

// Tier enum values
Tier.BRONZE   // 0
Tier.SILVER   // 1  
Tier.GOLD     // 2
Tier.PLATINUM // 3

// Helper functions
const tierName = getTierName(Tier.GOLD)        // "Gold"
const tierColors = getTierColors(Tier.GOLD)    // { primary: 'bg-yellow-500', ... }
const tierInfo = contractUtils.getTierInfo(Tier.GOLD) // Benefits, allocation, etc.
```

## 🛠️ Utility Functions

The `contractUtils` object provides helpful formatting and calculation functions:

```typescript
import { contractUtils } from '@/src/hooks/contracts'

// Formatting
contractUtils.formatTokenAmount('1000000000000000000') // "1"
contractUtils.formatCurrency(1234.56)                  // "$1,234.56"
contractUtils.formatPercentage(0.05)                   // "0.05%"

// Time calculations
contractUtils.calculateTimeUntilUnlock(startTime, lockPeriod) // "5d 12h"

// Tier information
contractUtils.getTierInfo(Tier.PLATINUM) 
// Returns: { name, color, benefits, pagsAllocation }
```

## 📊 Earnings Calculator

Calculate projections for different investment strategies:

```typescript
import { useEarningsCalculator } from '@/src/hooks/contracts'

function ProjectionComponent() {
  const calculator = useEarningsCalculator()
  
  // Staking projections
  const stakingReturns = calculator.calculateStakingReturns(
    '1000',  // amount
    2,       // tier (90 days)
    30       // days to calculate
  )
  
  // NFT royalty projections  
  const royaltyProjections = calculator.calculateRoyaltyProjections(
    5,           // NFT count
    Tier.GOLD,   // tier
    10000        // monthly streams
  )
  
  // NFT value appreciation
  const nftValue = calculator.calculateNFTValue(
    Tier.SILVER, // tier
    30,          // days held
    0.01         // initial price in ETH
  )
  
  return (
    <div>
      <h3>30-Day Staking Returns: {stakingReturns.totalReturn} PAGS</h3>
      <h3>Monthly Royalties: ${royaltyProjections.monthlyRoyalties}</h3>
      <h3>NFT Value: ${nftValue.currentValue} ({nftValue.roi}% ROI)</h3>
    </div>
  )
}
```

## ⚡ Performance Tips

1. **Use React Query**: All hooks use TanStack Query for caching and automatic refetching
2. **Batch Queries**: Related data is fetched together in combined hooks like `useUserDashboard()`
3. **Conditional Fetching**: Queries are disabled when required params are missing
4. **Automatic Refetching**: Important data refetches every 30-60 seconds
5. **Optimistic Updates**: Write hooks update cache immediately for better UX

## 🔧 Error Handling

All hooks include built-in error handling with toast notifications:

```typescript
const { mint, isLoading, isSuccess, hash } = useMusicNFTMint()

// Automatic toast notifications:
// ✅ "NFT minting initiated!" (on success)  
// ❌ "Minting failed" (on error)
// ✅ "NFT minted successfully!" (on confirmation)

// Manual error handling:
useEffect(() => {
  if (isSuccess) {
    // Transaction confirmed
    console.log('Transaction hash:', hash)
  }
}, [isSuccess, hash])
```

## 🧪 Testing

See the example components for comprehensive usage patterns:

```typescript
import { ContractIntegrationExample, SimpleContractDemo } from '@/src/components/examples/ContractIntegrationExample'

// Full-featured dashboard example
<ContractIntegrationExample />

// Simple testing component  
<SimpleContractDemo />
```

## 🤝 Contributing

When adding new contract functions:

1. Add the ABI entry to the appropriate file in `src/constants/contracts/abis/`
2. Create the hook in the appropriate file (`usePAGSToken.ts` or `useMusicNFT.ts`)
3. Export it from `index.ts`
4. Add usage examples to the README
5. Update the example component if needed

## 🐛 Troubleshooting

**Common Issues:**

1. **"Contract not deployed"**: Update contract addresses in ABI files
2. **"Transaction failed"**: Check user has sufficient balance/allowance
3. **"Invalid tier"**: Ensure tier enum values match contract
4. **"Hook not updating"**: Check if wallet is connected and on correct network

**Debug Tips:**

```typescript
// Enable query debugging
const pagsData = usePAGSUserData()
console.log('PAGS Data:', pagsData) // Check isLoading, error, data properties

// Check contract addresses
import { PAGS_TOKEN_ADDRESS, MUSIC_NFT_ADDRESS } from '@/src/constants/contracts/contracts'
console.log('Contract addresses:', { PAGS_TOKEN_ADDRESS, MUSIC_NFT_ADDRESS })

// Verify wallet connection
import { useAccount } from 'wagmi'
const { address, isConnected, chainId } = useAccount()
console.log('Wallet:', { address, isConnected, chainId })
```
