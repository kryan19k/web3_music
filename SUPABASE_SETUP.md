# PAGS Music Platform - Supabase Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jeidwpgexretlgjgzsps.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWR3cGdleHJldGxnamd6c3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDE4MzYsImV4cCI6MjA3MzAxNzgzNn0.797GY5p4nUbzQoMIRa9AbyyZcf7d_X1zq97oMaKuVKY

# IPFS Storage (Storacha)
VITE_STORACHA_SPACE_DID=did:key:z6Mkncfp4JyM52QFwbeaqSpBFzJ38YgB7a9iwryrp37JiTTz

# Web3 Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 2. Database Schema Setup

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: https://supabase.com/dashboard/project/jeidwpgexretlgjgzsps
3. Go to the SQL Editor
4. Copy and paste the contents of `src/lib/supabase-schema.sql`
5. Run the SQL script to create all tables and policies

### 3. Storage Buckets Setup

In your Supabase dashboard, create the following storage buckets:

1. **avatars** - Artist profile pictures
   - Public: Yes
   - File size limit: 5MB
   - Allowed file types: image/*

2. **cover-art** - Track cover art
   - Public: Yes
   - File size limit: 10MB
   - Allowed file types: image/*

3. **audio-files** - Track audio files
   - Public: Yes (for streaming)
   - File size limit: 50MB
   - Allowed file types: audio/*

4. **assets** - Lyrics and other files
   - Public: Yes
   - File size limit: 5MB
   - Allowed file types: text/*, application/pdf

### 4. Row Level Security (RLS) Policies

The SQL schema includes comprehensive RLS policies for:

- **Artists**: Users can only manage their own profiles
- **Tracks**: Artists can only manage their own tracks
- **NFT Tiers**: Tied to track ownership
- **Sales Data**: Public read access (blockchain data)
- **Analytics**: Private to artist owners

## 📊 Database Schema Overview

### Core Tables

1. **artists** - Artist profiles and metadata
2. **tracks** - Music tracks with metadata
3. **track_collaborators** - Multi-artist collaborations
4. **nft_tiers** - NFT pricing and benefits configuration
5. **nft_sales** - Purchase history and blockchain events
6. **artist_analytics** - Performance metrics and earnings

### Key Features

- **Wallet-based Authentication**: Each artist profile is tied to an Ethereum address
- **File Storage**: Integrated with Supabase Storage for media files
- **IPFS Ready**: Fields for IPFS hashes (Storacha integration coming soon)
- **Smart Contract Sync**: Track contract deployment status
- **Analytics**: Built-in analytics for streams, sales, and earnings

## 🔐 Authentication Flow

1. **Wallet Connection**: User connects MetaMask/WalletConnect
2. **Profile Check**: System checks if artist profile exists for wallet address
3. **Onboarding**: New users go through artist signup flow
4. **Session**: Supabase session created with wallet address as identifier

## 💾 Data Flow

```
Artist Signup → Supabase → Smart Contract → IPFS
     ↓              ↓            ↓           ↓
 Profile Data   Database    NFT Metadata  File Storage
```

## 🧪 Testing

The integration includes:

- **Service Layer**: `ArtistService` and `TrackService` classes
- **React Hooks**: `useSupabaseArtistSignup` for complete onboarding flow
- **Type Safety**: Full TypeScript coverage with auto-generated types
- **Error Handling**: Comprehensive error handling and user feedback

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env.local` to git
2. **RLS Policies**: Always test policies in development before production
3. **File Uploads**: Monitor storage usage and implement cleanup policies
4. **Rate Limits**: Supabase has rate limits on the free tier
5. **Backup**: Regular database backups recommended for production

## 📚 Next Steps

1. Test the artist signup flow
2. Implement smart contract synchronization
3. Add IPFS integration with Storacha
4. Set up analytics dashboard
5. Configure production environment

---

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/jeidwpgexretlgjgzsps)
- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
