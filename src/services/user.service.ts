/**
 * User Database Service
 * Handles all user-related database operations with Supabase
 */

import { supabase, uploadFile, STORAGE_BUCKETS } from '@/src/lib/supabase'
import { toast } from 'sonner'
import type { Address } from 'viem'

export interface UserProfile {
  id: string
  wallet_address: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  website: string | null
  social_links: Record<string, string> | null
  preferences: Record<string, any> | null
  privacy_settings: Record<string, boolean> | null
  is_private: boolean
  show_email: boolean
  show_wallet: boolean
  created_at: string
  updated_at: string
}

export interface UserProfileInsert {
  wallet_address: string
  display_name?: string | null
  bio?: string | null
  avatar_url?: string | null
  location?: string | null
  website?: string | null
  social_links?: Record<string, string> | null
  preferences?: Record<string, any> | null
  privacy_settings?: Record<string, boolean> | null
  is_private?: boolean
  show_email?: boolean
  show_wallet?: boolean
}

export interface UserProfileUpdate {
  display_name?: string | null
  bio?: string | null
  avatar_url?: string | null
  location?: string | null
  website?: string | null
  social_links?: Record<string, string> | null
  preferences?: Record<string, any> | null
  privacy_settings?: Record<string, boolean> | null
  is_private?: boolean
  show_email?: boolean
  show_wallet?: boolean
}

export class UserService {
  /**
   * Create or update a user profile
   * Uses upsert to handle both creation and updates
   */
  static async upsertUser(data: {
    walletAddress: string
    displayName?: string
    bio?: string
    location?: string
    website?: string
    socialLinks?: Record<string, string>
    avatarFile?: File
    privacySettings?: Record<string, boolean>
  }): Promise<{ user: UserProfile; error?: string }> {
    try {
      let avatarUrl: string | null = null

      // Upload avatar if provided
      if (data.avatarFile) {
        try {
          const avatarPath = `${data.walletAddress}/avatar-${Date.now()}.${data.avatarFile.name.split('.').pop()}`
          const uploadResult = await uploadFile(STORAGE_BUCKETS.AVATARS, avatarPath, data.avatarFile)
          
          if (uploadResult) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKETS.AVATARS)
              .getPublicUrl(avatarPath)
            avatarUrl = urlData.publicUrl
          }
        } catch (error) {
          console.warn('Avatar upload failed, continuing without avatar:', error)
        }
      }

      const userData: UserProfileInsert = {
        wallet_address: data.walletAddress.toLowerCase(),
        display_name: data.displayName || null,
        bio: data.bio || null,
        location: data.location || null,
        website: data.website || null,
        social_links: data.socialLinks || null,
        privacy_settings: data.privacySettings || {
          showEmail: false,
          showWallet: true,
          showActivity: true,
          showCollection: true,
        },
        is_private: false,
        show_email: false,
        show_wallet: true,
      }

      if (avatarUrl) {
        userData.avatar_url = avatarUrl
      }

      // Use upsert to handle both insert and update
      const { data: user, error } = await supabase
        .from('user_profiles')
        .upsert(userData, {
          onConflict: 'wallet_address',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error('Database error creating/updating user:', error)
        return { 
          user: null as any, 
          error: `Failed to save user profile: ${error.message}` 
        }
      }

      toast.success('Profile updated successfully!')
      return { user }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { 
        user: null as any, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Get user profile by wallet address
   */
  static async getByWalletAddress(walletAddress: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No user found - this is normal for new users
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user by wallet address:', error)
      throw error
    }
  }

  /**
   * Get user profile by ID
   */
  static async getById(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    walletAddress: string,
    updates: UserProfileUpdate
  ): Promise<{ user: UserProfile; error?: string }> {
    try {
      const { data: user, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress.toLowerCase())
        .select()
        .single()

      if (error) {
        console.error('Database error updating user:', error)
        return { 
          user: null as any, 
          error: `Failed to update user profile: ${error.message}` 
        }
      }

      return { user }
    } catch (error) {
      console.error('Unexpected error updating user:', error)
      return { 
        user: null as any, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Search users by display name
   */
  static async searchUsers(query: string, limit: number = 20): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`display_name.ilike.%${query}%,wallet_address.ilike.%${query}%`)
        .eq('is_private', false)
        .limit(limit)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }

  /**
   * Get user's social stats and activity
   */
  static async getUserStats(walletAddress: string): Promise<{
    followersCount: number
    followingCount: number
    totalActivity: number
  }> {
    try {
      // This would integrate with your social features if you have them
      // For now return basic stats
      return {
        followersCount: 0,
        followingCount: 0,
        totalActivity: 0,
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        followersCount: 0,
        followingCount: 0,
        totalActivity: 0,
      }
    }
  }

  /**
   * Delete user profile (GDPR compliance)
   */
  static async deleteProfile(walletAddress: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('wallet_address', walletAddress.toLowerCase())

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting user profile:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }
}
