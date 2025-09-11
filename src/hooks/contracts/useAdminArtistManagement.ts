/**
 * Admin Artist Management Hooks
 * Handles artist verification, role management, and statistics
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArtistService } from '@/src/services/artist.service'
import { useAdminGrantRole } from './useAdminContract'
import type { Artist } from '@/src/types/supabase'

// ============================================
// ARTIST FETCHING HOOKS
// ============================================

export function useAdminPendingArtists() {
  return useQuery({
    queryKey: ['admin-pending-artists'],
    queryFn: async () => {
      const { artists, error } = await ArtistService.getArtistsByVerificationStatus('pending')
      if (error) throw new Error(error)
      return artists || []
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

export function useAdminRecentArtists(limit = 10) {
  return useQuery({
    queryKey: ['admin-recent-artists', limit],
    queryFn: async () => {
      const { artists, error } = await ArtistService.getRecentArtists(limit)
      if (error) throw new Error(error)
      return artists || []
    },
  })
}

export function useAdminArtistStats() {
  return useQuery({
    queryKey: ['admin-artist-stats'],
    queryFn: async () => {
      const [pending, approved, rejected, total] = await Promise.all([
        ArtistService.getArtistsByVerificationStatus('pending'),
        ArtistService.getArtistsByVerificationStatus('approved'), 
        ArtistService.getArtistsByVerificationStatus('rejected'),
        ArtistService.getAllArtists()
      ])

      return {
        pending: pending.artists?.length || 0,
        approved: approved.artists?.length || 0,
        rejected: rejected.artists?.length || 0,
        total: total.artists?.length || 0,
      }
    },
    refetchInterval: 60000, // Refresh every minute
  })
}

export function useAdminArtistById(artistId?: string) {
  return useQuery({
    queryKey: ['admin-artist', artistId],
    queryFn: async () => {
      if (!artistId) return null
      const { artist, error } = await ArtistService.getArtistById(artistId)
      if (error) throw new Error(error)
      return artist
    },
    enabled: !!artistId,
  })
}

// ============================================
// ARTIST MANAGEMENT ACTIONS
// ============================================

export function useAdminApproveArtist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      artistId, 
      artistWallet, 
      grantSmartContractRole = true 
    }: { 
      artistId: string
      artistWallet: string
      grantSmartContractRole?: boolean
    }) => {
      // For now, let's separate these operations to avoid the complexity
      // First, just update the database
      const { success, error } = await ArtistService.updateVerificationStatus(artistId, 'approved')
      if (!success || error) {
        throw new Error(error || 'Failed to approve artist in database')
      }

      // Show success message
      if (grantSmartContractRole) {
        toast.success('Artist approved! Please grant blockchain role manually using the Role Management tab.', {
          description: 'Database updated successfully. Blockchain role pending.',
          duration: 10000
        })
      } else {
        toast.success('Artist approved successfully!')
      }

      return { 
        success: true, 
        requiresManualRoleGrant: grantSmartContractRole,
        artistWallet 
      }
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-pending-artists'] })
      queryClient.invalidateQueries({ queryKey: ['admin-artist-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-recent-artists'] })
      
      // If manual role grant is needed, we could potentially show a follow-up action
      if (data.requiresManualRoleGrant) {
        console.log('Manual role grant needed for wallet:', data.artistWallet)
      }
    },
    onError: (error) => {
      toast.error('Failed to approve artist', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    },
  })
}

export function useAdminRejectArtist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ artistId, reason }: { artistId: string, reason?: string }) => {
      const { success, error } = await ArtistService.updateVerificationStatus(artistId, 'rejected')
      if (!success || error) {
        throw new Error(error || 'Failed to reject artist')
      }
      
      // TODO: Send rejection reason to artist (email/notification)
      if (reason) {
        console.log('Rejection reason:', reason)
        // In a real app, you'd save this and notify the artist
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-artists'] })
      queryClient.invalidateQueries({ queryKey: ['admin-artist-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-recent-artists'] })
      toast.success('Artist application rejected')
    },
    onError: (error) => {
      toast.error('Failed to reject artist', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    },
  })
}

export function useAdminUpdateArtistStats() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      artistId, 
      updates 
    }: { 
      artistId: string
      updates: {
        tracks?: number
        earnings?: string
        streams?: number
        followers?: number
      }
    }) => {
      const { success, error } = await ArtistService.incrementStats(artistId, updates)
      if (!success || error) {
        throw new Error(error || 'Failed to update artist stats')
      }
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artist'] })
      queryClient.invalidateQueries({ queryKey: ['admin-recent-artists'] })
      toast.success('Artist statistics updated')
    },
    onError: (error) => {
      toast.error('Failed to update artist stats', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    },
  })
}

// ============================================
// COMBINED ARTIST MANAGEMENT HOOK
// ============================================

export function useAdminArtistManagement() {
  const pendingArtists = useAdminPendingArtists()
  const recentArtists = useAdminRecentArtists()
  const artistStats = useAdminArtistStats()
  const approveArtist = useAdminApproveArtist()
  const rejectArtist = useAdminRejectArtist()
  const updateStats = useAdminUpdateArtistStats()

  return {
    // Data
    pendingArtists: pendingArtists.data || [],
    recentArtists: recentArtists.data || [],
    stats: artistStats.data || { pending: 0, approved: 0, rejected: 0, total: 0 },
    
    // Loading states
    isLoadingPending: pendingArtists.isLoading,
    isLoadingRecent: recentArtists.isLoading,
    isLoadingStats: artistStats.isLoading,
    
    // Actions
    approveArtist: approveArtist.mutate,
    rejectArtist: rejectArtist.mutate,
    updateStats: updateStats.mutate,
    
    // Action loading states
    isApproving: approveArtist.isPending,
    isRejecting: rejectArtist.isPending,
    isUpdatingStats: updateStats.isPending,
  }
}
