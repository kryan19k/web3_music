-- Create user_profiles table for regular (non-artist) users
-- This complements the existing artists table

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{
    "showEmail": false,
    "showWallet": true,
    "showActivity": true,
    "showCollection": true
  }',
  is_private BOOLEAN DEFAULT false,
  show_email BOOLEAN DEFAULT false,
  show_wallet BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON user_profiles(display_name) WHERE display_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_private ON user_profiles(is_private);

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own profile and public profiles
CREATE POLICY "Users can read profiles" ON user_profiles
  FOR SELECT USING (
    is_private = false OR 
    wallet_address = lower(auth.jwt() ->> 'wallet_address')
  );

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (
    wallet_address = lower(auth.jwt() ->> 'wallet_address')
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (
    wallet_address = lower(auth.jwt() ->> 'wallet_address')
  );

-- Users can delete their own profile (GDPR compliance)
CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (
    wallet_address = lower(auth.jwt() ->> 'wallet_address')
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;

-- Create a view for public user data (useful for leaderboards, etc.)
CREATE OR REPLACE VIEW public_user_profiles AS
SELECT 
  id,
  wallet_address,
  display_name,
  avatar_url,
  location,
  bio,
  website,
  created_at,
  (privacy_settings ->> 'showWallet')::boolean as show_wallet
FROM user_profiles 
WHERE is_private = false;

GRANT SELECT ON public_user_profiles TO authenticated, anon;
