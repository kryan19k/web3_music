import React from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { useMusicNFTArtistRole } from '@/src/hooks/contracts/useMusicNFT'
import { usePublicClient, useReadContract } from 'wagmi'
import { COLLECTION_MUSIC_NFT_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFT'
import { CONTRACTS } from '@/src/constants/contracts/contracts'

/**
 * Debug panel to check contract state and user roles
 */
export function ContractDebugPanel() {
  const { address } = useAccount()
  
  // Check artist role
  const { data: hasArtistRole, isLoading: roleLoading, error: roleError } = useMusicNFTArtistRole(address)
  
  // Check if contract is paused
  const { data: isPaused, isLoading: pausedLoading } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'paused',
  })
  
  // Check total collections vs max
  const { data: totalCollections } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'totalCollections',
  })
  
  const { data: nextCollectionId } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'nextCollectionId',
  })
  
  // Check current phase
  const { data: currentPhase } = useReadContract({
    address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    abi: COLLECTION_MUSIC_NFT_ABI,
    functionName: 'currentPhase',
  })

  const MAX_COLLECTIONS = 1000 // From contract

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Contract Debug Panel
          {address && (
            <Badge variant="outline" className="text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Artist Role Status */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">🎭 Artist Role Status</h3>
          {roleLoading ? (
            <Badge variant="secondary">Loading...</Badge>
          ) : roleError ? (
            <div>
              <Badge variant="destructive">Error</Badge>
              <p className="text-sm text-red-600 mt-1">{roleError.message}</p>
            </div>
          ) : (
            <div>
              <Badge variant={hasArtistRole ? "default" : "destructive"}>
                {hasArtistRole ? "✅ HAS ARTIST_ROLE" : "❌ NO ARTIST_ROLE"}
              </Badge>
              {!hasArtistRole && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ You need ARTIST_ROLE to create collections. Contact admin to grant this role.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Contract State */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">🏗️ Contract State</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            <div>
              <span className="text-sm font-medium">Contract Status:</span>
              <Badge variant={isPaused ? "destructive" : "default"} className="ml-2">
                {pausedLoading ? "Loading..." : isPaused ? "⏸️ PAUSED" : "▶️ ACTIVE"}
              </Badge>
              {isPaused && (
                <p className="text-sm text-red-600 mt-1">Contract is paused - no collections can be created</p>
              )}
            </div>
            
            <div>
              <span className="text-sm font-medium">Sale Phase:</span>
              <Badge variant="outline" className="ml-2">
                {currentPhase === 0 ? "PAUSED" : currentPhase === 1 ? "ALLOWLIST" : currentPhase === 2 ? "PUBLIC" : "UNKNOWN"}
              </Badge>
            </div>
            
            <div>
              <span className="text-sm font-medium">Collections:</span>
              <Badge variant="outline" className="ml-2">
                {totalCollections?.toString() || "0"} / {MAX_COLLECTIONS}
              </Badge>
              {totalCollections && Number(totalCollections) >= MAX_COLLECTIONS && (
                <p className="text-sm text-red-600 mt-1">Max collections reached!</p>
              )}
            </div>
            
            <div>
              <span className="text-sm font-medium">Next Collection ID:</span>
              <Badge variant="outline" className="ml-2">
                {nextCollectionId?.toString() || "1"}
              </Badge>
            </div>
            
          </div>
        </div>

        {/* Contract Address */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">📋 Contract Info</h3>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Contract Address:</span>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                {CONTRACTS.CollectionMusicNFT.address}
              </code>
            </div>
          </div>
        </div>

        {/* Debug Actions */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">🛠️ Debug Actions</h3>
          <p className="text-sm text-gray-600">
            If you don't have ARTIST_ROLE, you can:
          </p>
          <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-gray-600">
            <li>Go to Admin Dashboard → User Management</li>
            <li>Find your address and grant ARTIST_ROLE</li>
            <li>Or contact an admin to grant the role</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  )
}
