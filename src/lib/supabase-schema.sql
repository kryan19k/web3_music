-- PAGS Music Platform Database Schema
-- Supabase SQL Schema for Artists and Tracks

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.track_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.nft_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.nft_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.artist_analytics ENABLE ROW LEVEL SECURITY;

-- Artists Table
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    genres TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT false,
    verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    total_tracks INTEGER DEFAULT 0,
    total_earnings DECIMAL(20,8) DEFAULT 0,
    total_streams INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    contract_track_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    genre TEXT NOT NULL,
    duration INTEGER,
    bpm INTEGER,
    key TEXT,
    audio_url TEXT,
    cover_art_url TEXT,
    lyrics_url TEXT,
    ipfs_audio_hash TEXT,
    ipfs_cover_hash TEXT,
    ipfs_lyrics_hash TEXT,
    is_explicit BOOLEAN DEFAULT false,
    rights_cleared BOOLEAN DEFAULT false,
    release_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    tags TEXT[] DEFAULT '{}',
    total_streams INTEGER DEFAULT 0,
    total_earnings DECIMAL(20,8) DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'processing', 'live', 'paused')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Track Collaborators Table
CREATE TABLE IF NOT EXISTS public.track_collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    collaborator_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    share_percentage DECIMAL(5,2) NOT NULL CHECK (share_percentage >= 0 AND share_percentage <= 100),
    wallet_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NFT Tiers Table
CREATE TABLE IF NOT EXISTS public.nft_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    tier_name TEXT CHECK (tier_name IN ('bronze', 'silver', 'gold', 'platinum')) NOT NULL,
    price_eth DECIMAL(20,8) NOT NULL,
    max_supply INTEGER NOT NULL,
    current_supply INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    benefits JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(track_id, tier_name)
);

-- NFT Sales Table
CREATE TABLE IF NOT EXISTS public.nft_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES public.nft_tiers(id) ON DELETE CASCADE,
    buyer_address TEXT NOT NULL,
    token_id INTEGER NOT NULL,
    price_eth DECIMAL(20,8) NOT NULL,
    transaction_hash TEXT NOT NULL UNIQUE,
    block_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Artist Analytics Table
CREATE TABLE IF NOT EXISTS public.artist_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    streams INTEGER DEFAULT 0,
    earnings DECIMAL(20,8) DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    nft_sales INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(artist_id, date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artists_wallet_address ON public.artists(wallet_address);
CREATE INDEX IF NOT EXISTS idx_artists_verified ON public.artists(verified);
CREATE INDEX IF NOT EXISTS idx_artists_created_at ON public.artists(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON public.tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_status ON public.tracks(status);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON public.tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON public.tracks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracks_total_streams ON public.tracks(total_streams DESC);

CREATE INDEX IF NOT EXISTS idx_nft_tiers_track_id ON public.nft_tiers(track_id);
CREATE INDEX IF NOT EXISTS idx_nft_sales_track_id ON public.nft_sales(track_id);
CREATE INDEX IF NOT EXISTS idx_nft_sales_buyer_address ON public.nft_sales(buyer_address);
CREATE INDEX IF NOT EXISTS idx_nft_sales_transaction_hash ON public.nft_sales(transaction_hash);

CREATE INDEX IF NOT EXISTS idx_artist_analytics_artist_id ON public.artist_analytics(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_analytics_date ON public.artist_analytics(date DESC);

-- Storage Buckets (create these in Supabase Dashboard)
-- avatars - for artist profile images
-- cover-art - for track cover art
-- audio-files - for track audio files
-- assets - for lyrics and other files

-- RLS Policies

-- Artists: Users can read all verified artists, but only update their own
CREATE POLICY "Artists are viewable by everyone" ON public.artists
    FOR SELECT USING (verified = true OR auth.uid()::text = wallet_address);

CREATE POLICY "Users can insert their own artist profile" ON public.artists
    FOR INSERT WITH CHECK (auth.uid()::text = wallet_address);

CREATE POLICY "Users can update their own artist profile" ON public.artists
    FOR UPDATE USING (auth.uid()::text = wallet_address);

-- Tracks: Public tracks viewable by everyone, artists can CRUD their own
CREATE POLICY "Public tracks are viewable by everyone" ON public.tracks
    FOR SELECT USING (
        status = 'live' OR 
        EXISTS (
            SELECT 1 FROM public.artists 
            WHERE artists.id = tracks.artist_id 
            AND artists.wallet_address = auth.uid()::text
        )
    );

CREATE POLICY "Artists can insert their own tracks" ON public.tracks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.artists 
            WHERE artists.id = tracks.artist_id 
            AND artists.wallet_address = auth.uid()::text
        )
    );

CREATE POLICY "Artists can update their own tracks" ON public.tracks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.artists 
            WHERE artists.id = tracks.artist_id 
            AND artists.wallet_address = auth.uid()::text
        )
    );

-- NFT Tiers: Viewable by everyone, manageable by track owner
CREATE POLICY "NFT tiers are viewable by everyone" ON public.nft_tiers
    FOR SELECT USING (true);

CREATE POLICY "Artists can manage their track tiers" ON public.nft_tiers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.tracks 
            JOIN public.artists ON tracks.artist_id = artists.id
            WHERE tracks.id = nft_tiers.track_id 
            AND artists.wallet_address = auth.uid()::text
        )
    );

-- NFT Sales: Viewable by everyone (public blockchain data)
CREATE POLICY "NFT sales are viewable by everyone" ON public.nft_sales
    FOR SELECT USING (true);

CREATE POLICY "System can insert NFT sales" ON public.nft_sales
    FOR INSERT WITH CHECK (true);

-- Collaborators: Viewable by everyone, manageable by track owner or collaborator
CREATE POLICY "Track collaborators are viewable by everyone" ON public.track_collaborators
    FOR SELECT USING (true);

CREATE POLICY "Artists can manage their track collaborators" ON public.track_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.tracks 
            JOIN public.artists ON tracks.artist_id = artists.id
            WHERE tracks.id = track_collaborators.track_id 
            AND artists.wallet_address = auth.uid()::text
        )
        OR auth.uid()::text = wallet_address
    );

-- Analytics: Viewable by artist owner only
CREATE POLICY "Artists can view their own analytics" ON public.artist_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.artists 
            WHERE artists.id = artist_analytics.artist_id 
            AND artists.wallet_address = auth.uid()::text
        )
    );

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON public.tracks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_nft_tiers_updated_at BEFORE UPDATE ON public.nft_tiers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Sample Data (optional)
-- You can remove this section if you don't want sample data

-- Insert some sample genres for testing
-- INSERT INTO public.genres (name) VALUES 
-- ('Electronic'), ('Hip Hop'), ('Rock'), ('Pop'), ('Jazz'), ('Classical'),
-- ('R&B'), ('Country'), ('Folk'), ('Reggae'), ('Blues'), ('Funk');

COMMIT;
