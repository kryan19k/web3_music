/**
 * Supabase Database Types
 * Auto-generated types for database schema
 */

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          wallet_address: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          cover_image_url: string | null
          website: string | null
          social_links: Json | null
          genres: string[] | null
          verified: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
          total_tracks: number
          total_earnings: string
          total_streams: number
          followers_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          display_name: string
          bio?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          website?: string | null
          social_links?: Json | null
          genres?: string[] | null
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          total_tracks?: number
          total_earnings?: string
          total_streams?: number
          followers_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          display_name?: string
          bio?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          website?: string | null
          social_links?: Json | null
          genres?: string[] | null
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          total_tracks?: number
          total_earnings?: string
          total_streams?: number
          followers_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          artist_id: string
          contract_track_id: number | null
          title: string
          description: string | null
          genre: string
          duration: number | null
          bpm: number | null
          key: string | null
          audio_url: string | null
          cover_art_url: string | null
          lyrics_url: string | null
          ipfs_audio_hash: string | null
          ipfs_cover_hash: string | null
          ipfs_lyrics_hash: string | null
          is_explicit: boolean
          rights_cleared: boolean
          release_date: string
          tags: string[] | null
          total_streams: number
          total_earnings: string
          status: 'draft' | 'processing' | 'live' | 'paused'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          contract_track_id?: number | null
          title: string
          description?: string | null
          genre: string
          duration?: number | null
          bpm?: number | null
          key?: string | null
          audio_url?: string | null
          cover_art_url?: string | null
          lyrics_url?: string | null
          ipfs_audio_hash?: string | null
          ipfs_cover_hash?: string | null
          ipfs_lyrics_hash?: string | null
          is_explicit?: boolean
          rights_cleared?: boolean
          release_date?: string
          tags?: string[] | null
          total_streams?: number
          total_earnings?: string
          status?: 'draft' | 'processing' | 'live' | 'paused'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          contract_track_id?: number | null
          title?: string
          description?: string | null
          genre?: string
          duration?: number | null
          bpm?: number | null
          key?: string | null
          audio_url?: string | null
          cover_art_url?: string | null
          lyrics_url?: string | null
          ipfs_audio_hash?: string | null
          ipfs_cover_hash?: string | null
          ipfs_lyrics_hash?: string | null
          is_explicit?: boolean
          rights_cleared?: boolean
          release_date?: string
          tags?: string[] | null
          total_streams?: number
          total_earnings?: string
          status?: 'draft' | 'processing' | 'live' | 'paused'
          created_at?: string
          updated_at?: string
        }
      }
      track_collaborators: {
        Row: {
          id: string
          track_id: string
          collaborator_id: string
          role: string
          share_percentage: number
          wallet_address: string
          created_at: string
        }
        Insert: {
          id?: string
          track_id: string
          collaborator_id: string
          role: string
          share_percentage: number
          wallet_address: string
          created_at?: string
        }
        Update: {
          id?: string
          track_id?: string
          collaborator_id?: string
          role?: string
          share_percentage?: number
          wallet_address?: string
          created_at?: string
        }
      }
      nft_tiers: {
        Row: {
          id: string
          track_id: string
          tier_name: 'bronze' | 'silver' | 'gold' | 'platinum'
          price_eth: string
          max_supply: number
          current_supply: number
          enabled: boolean
          benefits: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          track_id: string
          tier_name: 'bronze' | 'silver' | 'gold' | 'platinum'
          price_eth: string
          max_supply: number
          current_supply?: number
          enabled?: boolean
          benefits: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          track_id?: string
          tier_name?: 'bronze' | 'silver' | 'gold' | 'platinum'
          price_eth?: string
          max_supply?: number
          current_supply?: number
          enabled?: boolean
          benefits?: Json
          created_at?: string
          updated_at?: string
        }
      }
      nft_sales: {
        Row: {
          id: string
          track_id: string
          tier_id: string
          buyer_address: string
          token_id: number
          price_eth: string
          transaction_hash: string
          block_number: number
          created_at: string
        }
        Insert: {
          id?: string
          track_id: string
          tier_id: string
          buyer_address: string
          token_id: number
          price_eth: string
          transaction_hash: string
          block_number: number
          created_at?: string
        }
        Update: {
          id?: string
          track_id?: string
          tier_id?: string
          buyer_address?: string
          token_id?: number
          price_eth?: string
          transaction_hash?: string
          block_number?: number
          created_at?: string
        }
      }
      artist_analytics: {
        Row: {
          id: string
          artist_id: string
          date: string
          streams: number
          earnings: string
          new_followers: number
          nft_sales: number
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          date: string
          streams?: number
          earnings?: string
          new_followers?: number
          nft_sales?: number
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          date?: string
          streams?: number
          earnings?: string
          new_followers?: number
          nft_sales?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Artist = Database['public']['Tables']['artists']['Row']
export type ArtistInsert = Database['public']['Tables']['artists']['Insert']
export type ArtistUpdate = Database['public']['Tables']['artists']['Update']

export type Track = Database['public']['Tables']['tracks']['Row']
export type TrackInsert = Database['public']['Tables']['tracks']['Insert']
export type TrackUpdate = Database['public']['Tables']['tracks']['Update']

export type NFTTier = Database['public']['Tables']['nft_tiers']['Row']
export type NFTTierInsert = Database['public']['Tables']['nft_tiers']['Insert']
export type NFTTierUpdate = Database['public']['Tables']['nft_tiers']['Update']

export type TrackCollaborator = Database['public']['Tables']['track_collaborators']['Row']
export type NFTSale = Database['public']['Tables']['nft_sales']['Row']
export type ArtistAnalytics = Database['public']['Tables']['artist_analytics']['Row']

// Social links interface
export interface SocialLinks {
  twitter?: string
  instagram?: string
  spotify?: string
  soundcloud?: string
  youtube?: string
  website?: string
}

// NFT Tier Benefits interface
export interface TierBenefits {
  hasBackstageAccess: boolean
  hasRemixRights: boolean
  hasStemAccess: boolean
  hasExclusiveContent: boolean
  merchDiscount: number
  concertPriority: number
  maxGuestListSpots: number
  hasGovernanceRights: boolean
}

