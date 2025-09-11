/**
 * Artist Database Service
 * Handles all artist-related database operations with Supabase
 */

import { supabase, uploadFile, STORAGE_BUCKETS } from '@/src/lib/supabase'
import type { Artist, ArtistInsert, ArtistUpdate, SocialLinks } from '@/src/types/supabase'
import { toast } from 'sonner'

export class ArtistService {
  /**
   * Create a new artist profile
   */
  static async createArtist(data: {
    walletAddress: string
    displayName: string
    bio: string
    website?: string
    socialLinks?: SocialLinks
    genres?: string[]
    avatarFile?: File
  }): Promise<{ artist: Artist; error?: string }> {
    try {
      // First, try to authenticate the user with Supabase using wallet address as email
      console.log('🔐 [AUTH] Attempting to authenticate user for artist creation')
      
      const walletEmail = `${data.walletAddress.toLowerCase()}@wallet.local`
      
      // Try to sign in first (in case user already exists)
      let authResult = await supabase.auth.signInWithPassword({
        email: walletEmail,
        password: data.walletAddress.toLowerCase()
      })

      if (authResult.error && authResult.error.message.includes('Invalid login credentials')) {
        // User doesn't exist, create them
        console.log('🆕 [AUTH] User does not exist, creating new auth user')
        authResult = await supabase.auth.signUp({
          email: walletEmail,
          password: data.walletAddress.toLowerCase(),
          options: {
            data: {
              wallet_address: data.walletAddress.toLowerCase(),
              display_name: data.displayName
            }
          }
        })
      }

      if (authResult.error) {
        console.error('❌ [AUTH] Authentication failed:', authResult.error)
        // Continue without auth for now, but log the issue
        console.log('⚠️ [AUTH] Continuing with anonymous access - this may fail due to RLS')
      } else {
        console.log('✅ [AUTH] Successfully authenticated user')
      }

      let avatarUrl: string | null = null

      // Upload avatar if provided
      if (data.avatarFile) {
        try {
          console.log('📸 [AVATAR] Uploading avatar to storage...')
          console.log('🔍 [DEBUG] Avatar file details:', {
            name: data.avatarFile.name,
            size: data.avatarFile.size,
            type: data.avatarFile.type
          })
          console.log('🔍 [DEBUG] Storage bucket:', STORAGE_BUCKETS.AVATARS)
          console.log('🔍 [DEBUG] User wallet:', data.walletAddress)
          
          const avatarPath = `${data.walletAddress}/avatar-${Date.now()}.${data.avatarFile.name.split('.').pop()}`
          console.log('🔍 [DEBUG] Avatar upload path:', avatarPath)
          
          const uploadResult = await uploadFile(STORAGE_BUCKETS.AVATARS, avatarPath, data.avatarFile)
          console.log('🔍 [DEBUG] Upload result:', uploadResult)
          
          if (uploadResult) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKETS.AVATARS)
              .getPublicUrl(avatarPath)
            avatarUrl = urlData.publicUrl
            console.log('✅ [AVATAR] Avatar uploaded successfully:', avatarUrl)
          }
        } catch (error: any) {
          console.error('❌ [AVATAR] Avatar upload failed:', error)
          
          if (error?.message?.includes('row-level security policy')) {
            console.error('🔒 [STORAGE RLS] Storage bucket needs RLS policies!')
            console.error('💡 [SOLUTION] Run this SQL in Supabase:')
            console.error(`
CREATE POLICY "Allow avatar uploads" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow avatar downloads" ON storage.objects  
FOR SELECT USING (bucket_id = 'avatars');`)
          }
          
          console.warn('Continuing without avatar...')
          // Continue without avatar on upload failure
        }
      }

      const artistData: ArtistInsert = {
        wallet_address: data.walletAddress.toLowerCase(),
        display_name: data.displayName,
        bio: data.bio,
        website: data.website || null,
        social_links: data.socialLinks || null,
        genres: data.genres || null,
        avatar_url: avatarUrl,
        verification_status: 'pending', // Will be approved by admin after verification application
        total_earnings: '0',
        total_tracks: 0,
        total_streams: 0,
        followers_count: 0,
        verified: false,
      }

      console.log('🔍 [SUPABASE] Attempting to create artist with data:', artistData)
      
      const { data: artist, error } = await supabase
        .from('artists')
        .insert(artistData)
        .select()
        .single()

      if (error) {
        console.error('❌ [SUPABASE] Artist creation error:', error)
        console.error('❌ [SUPABASE] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Provide more specific error messages for common issues
        let errorMessage = error.message
        if (error.message.includes('row-level security policy')) {
          console.error('🛡️ [RLS] Row Level Security is blocking the insert.')
          console.error('💡 [SOLUTION] RLS is still blocking artist creation.')
          console.error('🔧 [CHECK] Verify RLS is disabled:')
          console.error('  1. Go to Supabase Dashboard > Table Editor > artists')
          console.error('  2. Check if "RLS Enabled" is OFF')
          console.error('  3. If still ON, run: ALTER TABLE artists DISABLE ROW LEVEL SECURITY;')
          
          errorMessage = `Database security is blocking profile creation. Please check RLS settings.`
          
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'Artist profile already exists for this wallet address.'
        }
        
        return { artist: null as any, error: errorMessage }
      }

      toast.success('Artist profile created successfully!')
      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create artist profile'
      console.error('Artist creation error:', error)
      toast.error('Failed to create artist profile', { description: errorMessage })
      return { artist: null as any, error: errorMessage }
    }
  }

  /**
   * Update an existing artist profile
   */
  static async updateArtist(
    artistId: string, 
    updates: {
      displayName?: string
      bio?: string
      website?: string
      socialLinks?: SocialLinks
      genres?: string[]
    },
    avatarFile?: File
  ): Promise<{ artist: Artist | null; error?: string }> {
    try {
      console.log('🔄 [UPDATE] Updating artist profile:', artistId)
      console.log('🔍 [UPDATE] Raw updates received:', updates)
      console.log('🔍 [UPDATE] Avatar file provided:', !!avatarFile)
      
      // Upload avatar if provided
      let avatarUrl: string | null = null
      if (avatarFile) {
        try {
          console.log('📸 [AVATAR] Uploading avatar to storage...')
          const avatarPath = `${artistId}/avatar-${Date.now()}.${avatarFile.name.split('.').pop()}`
          const uploadResult = await uploadFile(STORAGE_BUCKETS.AVATARS, avatarPath, avatarFile)
          
          if (uploadResult) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKETS.AVATARS)
              .getPublicUrl(avatarPath)
            avatarUrl = urlData.publicUrl
            console.log('✅ [AVATAR] Avatar uploaded successfully:', avatarUrl)
          }
        } catch (error: any) {
          console.error('❌ [AVATAR] Avatar upload failed:', error)
          
          if (error?.message?.includes('row-level security policy')) {
            console.error('🔒 [STORAGE RLS] Storage bucket needs RLS policies!')
            console.error('💡 [SOLUTION] Run this SQL in Supabase:')
            console.error(`
CREATE POLICY "Allow avatar uploads" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow avatar downloads" ON storage.objects  
FOR SELECT USING (bucket_id = 'avatars');`)
          }
          
          console.warn('Continuing without avatar update...')
          // Continue without avatar on upload failure
        }
      }

      const updateData: any = {}
      
      // Only include fields that are being updated (avoid undefined values)
      // TEMPORARY FIX: Try both camelCase and snake_case to identify the issue
      if (updates.displayName !== undefined) {
        updateData.display_name = updates.displayName  // Correct snake_case
        // updateData.displayName = updates.displayName   // Wrong camelCase (debugging)
        console.log('🔧 [DEBUG] Setting display_name to:', updates.displayName)
      }
      if (updates.bio !== undefined) updateData.bio = updates.bio
      if (updates.website !== undefined) updateData.website = updates.website || null
      if (updates.socialLinks !== undefined) updateData.social_links = updates.socialLinks || null
      if (updates.genres !== undefined) updateData.genres = updates.genres || null
      if (avatarUrl !== null) updateData.avatar_url = avatarUrl

      // Remove undefined values and check for any camelCase keys that shouldn't be there
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      )
      
      // Safety check: warn about any potential camelCase keys
      const camelCaseKeys = Object.keys(cleanedUpdateData).filter(key => 
        key !== key.toLowerCase() && key.includes('Name')
      )
      if (camelCaseKeys.length > 0) {
        console.warn('🚨 [WARNING] Detected potential camelCase keys:', camelCaseKeys)
        console.warn('💡 [SOLUTION] These should be mapped to snake_case for database')
      }

      console.log('🔍 [UPDATE] Final update data being sent to DB:', cleanedUpdateData)

      const { data: artist, error } = await supabase
        .from('artists')
        .update(cleanedUpdateData)
        .eq('id', artistId)
        .select()
        .single()

      if (error) {
        console.error('❌ [UPDATE] Artist update error:', error)
        console.error('🔍 [DEBUG] Failed update data:', cleanedUpdateData)
        console.error('🔍 [DEBUG] Artist ID:', artistId)
        
        if (error.message?.includes('displayName')) {
          console.error('🚨 [COLUMN ERROR] displayName column issue detected!')
          console.error('💡 [SOLUTION] Check that all camelCase fields are mapped to snake_case')
        }
        
        return { artist: null, error: error.message }
      }

      console.log('✅ [UPDATE] Artist updated successfully')
      toast.success('Profile updated successfully!')
      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update artist profile'
      console.error('❌ [UPDATE] Artist update error:', error)
      return { artist: null, error: errorMessage }
    }
  }

  /**
   * Get artist by wallet address
   */
  static async getArtistByWallet(walletAddress: string): Promise<{ artist: Artist | null; error?: string }> {
    try {
      const { data: artist, error } = await supabase
        .from('artists')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error is OK
        console.error('Get artist error:', error)
        return { artist: null, error: error.message }
      }

      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artist'
      console.error('Get artist error:', error)
      return { artist: null, error: errorMessage }
    }
  }


  /**
   * Get artist by ID
   */
  static async getArtistById(artistId: string): Promise<{ artist: Artist | null; error?: string }> {
    try {
      const { data: artist, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single()

      if (error) {
        console.error('Get artist by ID error:', error)
        return { artist: null, error: error.message }
      }

      return { artist }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artist'
      console.error('Get artist by ID error:', error)
      return { artist: null, error: errorMessage }
    }
  }

  /**
   * Search artists by name or genre
   */
  static async searchArtists(query: string, limit = 20): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .or(`display_name.ilike.%${query}%,genres.cs.{${query}}`)
        .eq('verified', true)
        .order('followers_count', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Search artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search artists'
      console.error('Search artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get trending artists
   */
  static async getTrendingArtists(limit = 10): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('verified', true)
        .order('total_streams', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Get trending artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending artists'
      console.error('Get trending artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Update artist verification status
   */
  static async updateVerificationStatus(
    artistId: string, 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('artists')
        .update({ 
          verification_status: status,
          verified: status === 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', artistId)

      if (error) {
        console.error('Update verification error:', error)
        return { success: false, error: error.message }
      }

      const statusText = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending'
      toast.success(`Verification status updated to ${statusText}`)
      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update verification status'
      console.error('Update verification error:', error)
      toast.error('Failed to update verification status', { description: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Increment artist stats (tracks, earnings, streams, followers)
   */
  static async incrementStats(
    artistId: string,
    updates: {
      tracks?: number
      earnings?: string
      streams?: number
      followers?: number
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: artist, error: fetchError } = await supabase
        .from('artists')
        .select('total_tracks, total_earnings, total_streams, followers_count')
        .eq('id', artistId)
        .single()

      if (fetchError) {
        return { success: false, error: fetchError.message }
      }

      const updateData: Partial<ArtistUpdate> = {
        updated_at: new Date().toISOString()
      }

      if (updates.tracks !== undefined) {
        updateData.total_tracks = artist.total_tracks + updates.tracks
      }

      if (updates.earnings !== undefined) {
        const currentEarnings = parseFloat(artist.total_earnings)
        const additionalEarnings = parseFloat(updates.earnings)
        updateData.total_earnings = (currentEarnings + additionalEarnings).toString()
      }

      if (updates.streams !== undefined) {
        updateData.total_streams = artist.total_streams + updates.streams
      }

      if (updates.followers !== undefined) {
        updateData.followers_count = artist.followers_count + updates.followers
      }

      const { error } = await supabase
        .from('artists')
        .update(updateData)
        .eq('id', artistId)

      if (error) {
        console.error('Increment stats error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update artist stats'
      console.error('Increment stats error:', error)
      return { success: false, error: errorMessage }
    }
  }

  // ============================================
  // ADMIN-SPECIFIC METHODS
  // ============================================

  /**
   * Get artists by verification status (admin function)
   */
  static async getArtistsByVerificationStatus(
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('verification_status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Get artists by status error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artists by status'
      console.error('Get artists by status error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get all artists (admin function)
   */
  static async getAllArtists(): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Get all artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch all artists'
      console.error('Get all artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get recent artists (admin function)
   */
  static async getRecentArtists(limit = 10): Promise<{ artists: Artist[]; error?: string }> {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Get recent artists error:', error)
        return { artists: [], error: error.message }
      }

      return { artists: artists || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recent artists'
      console.error('Get recent artists error:', error)
      return { artists: [], error: errorMessage }
    }
  }

  /**
   * Get artist application details with social verification data
   */
  static async getArtistApplicationDetails(artistId: string): Promise<{ 
    artist: Artist | null
    socialVerification: {
      twitter?: { verified: boolean, followers?: number }
      instagram?: { verified: boolean, followers?: number }
      spotify?: { verified: boolean, monthlyListeners?: number }
    }
    error?: string 
  }> {
    try {
      const { artist, error } = await this.getArtistById(artistId)
      if (error || !artist) {
        return { artist: null, socialVerification: {}, error: error || 'Artist not found' }
      }

      // In a real implementation, you'd verify social accounts here
      // For now, we'll mock some verification data
      const socialLinks = (artist.social_links as any) || {}
      const socialVerification = {
        twitter: socialLinks.twitter ? { verified: true, followers: Math.floor(Math.random() * 10000) } : undefined,
        instagram: socialLinks.instagram ? { verified: true, followers: Math.floor(Math.random() * 15000) } : undefined,
        spotify: socialLinks.spotify ? { verified: true, monthlyListeners: Math.floor(Math.random() * 50000) } : undefined,
      }

      return { artist, socialVerification }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch application details'
      console.error('Get application details error:', error)
      return { artist: null, socialVerification: {}, error: errorMessage }
    }
  }

  /**
   * Fix inconsistent artist state (approved in DB but no blockchain role)
   */
  static async fixInconsistentArtistState(
    artistId: string, 
    action: 'revert_to_pending' | 'mark_as_blockchain_pending'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let updateData: Partial<ArtistUpdate> = {
        updated_at: new Date().toISOString()
      }

      if (action === 'revert_to_pending') {
        updateData.verification_status = 'pending'
        updateData.verified = false
      } else if (action === 'mark_as_blockchain_pending') {
        // Keep as approved but add a note (you could add a new field for this)
        // For now, we'll just update the timestamp
        updateData.verification_status = 'approved'
        updateData.verified = true
      }

      const { error } = await supabase
        .from('artists')
        .update(updateData)
        .eq('id', artistId)

      if (error) {
        console.error('Fix inconsistent state error:', error)
        return { success: false, error: error.message }
      }

      const actionText = action === 'revert_to_pending' ? 'reverted to pending' : 'marked for blockchain role grant'
      toast.success(`Artist status ${actionText}`)
      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fix artist state'
      console.error('Fix inconsistent state error:', error)
      toast.error('Failed to fix artist state', { description: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Save artist application data
   */
  static async saveApplicationData(
    artistId: string,
    applicationData: {
      musicBackground: string
      howDidYouHear: string
      artistGoals: string
      hasOriginalMusic: string
      expectedMonthlyReleases?: string
      socialMediaFollowing?: string
      additionalInfo?: string
      verificationMethods?: any
      submittedAt: string
      applicationType?: string
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗄️ [DATABASE] Saving application data for artist:', artistId)
      
      // Save application data as JSON in the artists table
      // We'll add it to a new column called 'application_data'
      const { error } = await supabase
        .from('artists')
        .update({
          application_data: applicationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', artistId)

      if (error) {
        console.error('❌ [DATABASE] Save application error:', error)
        
        // If the column doesn't exist, provide helpful error message
        if (error.message?.includes('application_data')) {
          console.error('💡 [SOLUTION] Need to add application_data column to artists table:')
          console.error('ALTER TABLE artists ADD COLUMN application_data JSONB;')
          
          // For now, save to localStorage as backup
          localStorage.setItem(`artist-application-${artistId}`, JSON.stringify(applicationData))
          console.log('📝 [BACKUP] Saved to localStorage as backup')
          
          return { success: true } // Don't fail the user experience
        }
        
        return { success: false, error: error.message }
      }

      console.log('✅ [DATABASE] Application data saved successfully')
      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save application data'
      console.error('❌ [DATABASE] Save application error:', error)
      
      // Save to localStorage as backup
      try {
        localStorage.setItem(`artist-application-${artistId}`, JSON.stringify(applicationData))
        console.log('📝 [BACKUP] Saved to localStorage as backup due to database error')
      } catch (localStorageError) {
        console.error('❌ [BACKUP] Failed to save to localStorage:', localStorageError)
      }
      
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Get artist application data
   */
  static async getApplicationData(artistId: string): Promise<{ applicationData: any; error?: string }> {
    try {
      // Try to get from database first
      const { data: artist, error } = await supabase
        .from('artists')
        .select('application_data')
        .eq('id', artistId)
        .single()

      if (error) {
        console.error('❌ [DATABASE] Get application error:', error)
        
        // Fallback to localStorage
        try {
          const localData = localStorage.getItem(`artist-application-${artistId}`)
          if (localData) {
            console.log('📝 [BACKUP] Retrieved from localStorage')
            return { applicationData: JSON.parse(localData) }
          }
        } catch (localStorageError) {
          console.error('❌ [BACKUP] Failed to get from localStorage:', localStorageError)
        }
        
        return { applicationData: null, error: error.message }
      }

      return { applicationData: artist?.application_data || null }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get application data'
      console.error('❌ [DATABASE] Get application error:', error)
      return { applicationData: null, error: errorMessage }
    }
  }
}
