import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Textarea } from '@/src/components/ui/textarea'
import { 
  Users, 
  Shield, 
  Search, 
  UserCheck, 
  UserX, 
  Music, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Twitter,
  Instagram,
  Globe,
  Calendar,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { 
  useAdminContractData,
  useAdminGrantRole,
  useAdminRevokeRole
} from '@/src/hooks/contracts'
import { useAdminArtistManagement } from '@/src/hooks/contracts/useAdminArtistManagement'
import { ArtistService } from '@/src/services/artist.service'
import { useQueryClient } from '@tanstack/react-query'
import type { Artist } from '@/src/types/supabase'

// Extend window object for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

export function UserManagement() {
  const { roleInfo, isAuthorized } = useAdminContractData()
  const { grantRole, isLoading: isGranting } = useAdminGrantRole()
  const { revokeRole, isLoading: isRevoking } = useAdminRevokeRole()
  const { address, isConnected, chain } = useAccount()
  const queryClient = useQueryClient()

  // Debug wallet info
  console.log('🔗 UserManagement wallet info:', { 
    address, 
    isConnected, 
    chainId: chain?.id, 
    chainName: chain?.name,
    chain: chain 
  })
  
  // Debug role info
  console.log('🎭 Role info debug:', {
    roleInfo,
    roles: roleInfo?.roles,
    isLoading: roleInfo?.isLoading,
    hasRoles: roleInfo?.roles && Object.keys(roleInfo.roles).length > 0
  })
  
  // CORRECT role hashes - TESTED & CONFIRMED WORKING!
  const FALLBACK_ROLES = {
    admin: '0x0000000000000000000000000000000000000000000000000000000000000000', // DEFAULT_ADMIN_ROLE
    manager: '0x4d414e414745525f524f4c45', // hex("MANAGER_ROLE")
    artist: '0x4152544953545f524f4c45',  // hex("ARTIST_ROLE") - ✅ CONFIRMED WORKING IN BLOCK EXPLORER!
    oracle: '0x4f5241434c455f524f4c45'   // hex("ORACLE_ROLE")
  }
  
  // Use fallback if roles aren't loading
  const hasValidRoles = roleInfo?.roles && Object.keys(roleInfo.roles).length > 0 && roleInfo.roles.artist
  const availableRoles = hasValidRoles ? roleInfo.roles : FALLBACK_ROLES
  
  console.log('🔧 Role debugging:', {
    hasValidRoles,
    roleInfoRoles: roleInfo?.roles,
    fallbackRoles: FALLBACK_ROLES,
    finalRoles: availableRoles,
    artistRole: availableRoles?.artist
  })
  
  // Artist management
  const {
    pendingArtists,
    recentArtists,
    stats,
    isLoadingPending,
    isLoadingStats,
    approveArtist,
    rejectArtist,
    isApproving,
    isRejecting
  } = useAdminArtistManagement()

  // Role management state
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  
  // Artist management state
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  if (!isAuthorized) {
    return (
      <div className="text-center py-8">
        <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Admin Access Required</h3>
        <p className="text-muted-foreground">
          You need admin privileges to manage users and roles.
        </p>
      </div>
    )
  }

  const handleGrantRole = () => {
    if (!selectedAddress || !selectedRole) {
      console.log('❌ Grant role failed: Missing address or role', { selectedAddress, selectedRole })
      toast.error('Please select both address and role')
      return
    }
    
    console.log('🚀 Attempting to grant role:', { 
      selectedAddress, 
      selectedRole, 
      addressType: typeof selectedAddress,
      roleType: typeof selectedRole 
    })
    
    grantRole({ 
      role: selectedRole, 
      account: selectedAddress as `0x${string}` 
    })
  }

  const handleRevokeRole = () => {
    if (!selectedAddress || !selectedRole) return
    revokeRole({ 
      role: selectedRole, 
      account: selectedAddress as `0x${string}` 
    })
  }

  const handleApproveArtist = (artist: Artist) => {
    approveArtist({
      artistId: artist.id,
      artistWallet: artist.wallet_address,
      grantSmartContractRole: true
    })
  }

  const handleRejectArtist = (artist: Artist) => {
    rejectArtist({
      artistId: artist.id,
      reason: rejectionReason || undefined
    })
    setRejectionReason('')
    setSelectedArtist(null)
  }

  const formatSocialLink = (platform: string, username?: string) => {
    if (!username) return null
    return username.startsWith('@') ? username : `@${username}`
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="artists" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="artists">Artist Management</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
        </TabsList>

        {/* Artist Management Tab */}
        <TabsContent value="artists" className="space-y-6">
          {/* Artist Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending Applications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.approved}</div>
                  <div className="text-sm text-muted-foreground">Approved Artists</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.rejected}</div>
                  <div className="text-sm text-muted-foreground">Rejected Applications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Artists</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Pending Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Pending Artist Applications
                  {stats.pending > 0 && (
                    <Badge variant="destructive">{stats.pending}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPending ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading applications...</p>
                  </div>
                ) : pendingArtists.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">No pending artist applications to review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingArtists.map((artist, index) => (
                      <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={artist.avatar_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                {artist.display_name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{artist.display_name}</h4>
                                <Badge variant="outline">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDistanceToNow(new Date(artist.created_at), { addSuffix: true })}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {artist.bio}
                              </p>
                              
                              {/* Social Links */}
                              <div className="flex items-center gap-2">
                                {artist.social_links && typeof artist.social_links === 'object' && (
                                  <>
                                    {(artist.social_links as any).twitter && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Twitter className="h-3 w-3 mr-1" />
                                        {formatSocialLink('twitter', (artist.social_links as any).twitter)}
                                      </Badge>
                                    )}
                                    {(artist.social_links as any).instagram && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Instagram className="h-3 w-3 mr-1" />
                                        {formatSocialLink('instagram', (artist.social_links as any).instagram)}
                                      </Badge>
                                    )}
                                  </>
                                )}
                                {artist.website && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Globe className="h-3 w-3 mr-1" />
                                    Website
                                  </Badge>
                                )}
                              </div>

                              {/* Genres */}
                              {artist.genres && artist.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {artist.genres.map((genre, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {genre}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Wallet Address */}
                              <div className="text-xs text-muted-foreground font-mono">
                                Wallet: {artist.wallet_address}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => setSelectedArtist(artist)}
                              variant="outline"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {/* Quick DB-only approval */}
                            <Button
                              size="sm"
                              onClick={() => approveArtist({
                                artistId: artist.id,
                                artistWallet: artist.wallet_address,
                                grantSmartContractRole: false
                              })}
                              disabled={isApproving}
                              className="bg-blue-600 hover:bg-blue-700"
                              title="Approve in database only (faster)"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {isApproving ? 'Approving...' : 'Quick Approve'}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedArtist(artist)
                                setRejectionReason('')
                              }}
                              disabled={isRejecting}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Artists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Artists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentArtists.slice(0, 5).map((artist) => (
                    <div key={artist.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={artist.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {artist.display_name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{artist.display_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(artist.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          artist.verification_status === 'approved' ? 'default' :
                          artist.verification_status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {artist.verification_status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {artist.total_tracks} tracks
                        </div>
                        {artist.verification_status === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs px-2 py-1 h-6"
                            onClick={async () => {
                              const { success } = await ArtistService.fixInconsistentArtistState(artist.id, 'revert_to_pending')
                              if (success) {
                                // Refresh the data
                                queryClient.invalidateQueries({ queryKey: ['admin-recent-artists'] })
                                queryClient.invalidateQueries({ queryKey: ['admin-artist-stats'] })
                              }
                            }}
                            title="Revert to pending if blockchain transaction failed"
                          >
                            Fix Status
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Role Management Tab */}
        <TabsContent value="roles" className="space-y-6">
          {/* Role Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Smart Contract Role Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">User Address</Label>
                    <Input
                      id="address"
                      placeholder="0x..."
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                      Quick fill from approved artists:
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {recentArtists
                        .filter(artist => artist.verification_status === 'approved')
                        .slice(0, 5)
                        .map(artist => (
                          <Button
                            key={artist.id}
                            size="sm"
                            variant="outline"
                            className="text-xs p-1 h-6"
                            onClick={() => setSelectedAddress(artist.wallet_address)}
                          >
                            {artist.display_name}
                          </Button>
                        ))
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={selectedRole}
                      onChange={(e) => {
                        console.log('🔄 Role selected:', e.target.value)
                        setSelectedRole(e.target.value)
                      }}
                    >
                      <option value="">Select Role</option>
                      <option value={availableRoles?.manager || FALLBACK_ROLES.manager}>
                        Manager ({(availableRoles?.manager || FALLBACK_ROLES.manager).slice(0, 10)}...)
                      </option>
                      <option value={availableRoles?.artist || FALLBACK_ROLES.artist}>
                        Artist ({(availableRoles?.artist || FALLBACK_ROLES.artist).slice(0, 10)}...)
                      </option>
                      <option value={availableRoles?.oracle || FALLBACK_ROLES.oracle}>
                        Oracle ({(availableRoles?.oracle || FALLBACK_ROLES.oracle).slice(0, 10)}...)
                      </option>
                    </select>
                    <div className="text-xs text-muted-foreground">
                      Role hashes: {JSON.stringify(availableRoles, null, 2)}
                    </div>
                  </div>
                </div>

                {/* Network Status Check */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border">
                  <div className="text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="font-medium">Network Status:</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={async () => {
                          try {
                            if (window.ethereum) {
                              // Use hex format for MetaMask
                              const targetChainId = '0x13882' // 80002 in hex
                              await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: targetChainId }]
                              })
                            }
                          } catch (error: any) {
                            // If chain doesn't exist, add it
                            if (error.code === 4902) {
                              try {
                                await window.ethereum.request({
                                  method: 'wallet_addEthereumChain',
                                  params: [{
                                    chainId: '0x13882', // 80002 in hex (MetaMask requires hex)
                                    chainName: 'Polygon Amoy Testnet',
                                    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                                    nativeCurrency: {
                                      name: 'MATIC',
                                      symbol: 'MATIC',
                                      decimals: 18
                                    },
                                    blockExplorerUrls: ['https://amoy.polygonscan.com/']
                                  }]
                                })
                              } catch (addError) {
                                console.error('Failed to add network:', addError)
                              }
                            }
                          }
                        }}
                      >
                        Switch Network
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Connected: {isConnected ? '✅' : '❌'}<br/>
                      Chain ID: {chain?.id || 'undefined'}<br/>
                      Chain Name: {chain?.name || 'undefined'}<br/>
                      Currency: {chain?.nativeCurrency?.symbol || 'Unknown'}<br/>
                      {!isConnected && <span className="text-red-600">⚠️ Please connect your wallet</span>}
                      {isConnected && chain?.id !== 80002 && chain?.name && !chain.name.includes('Amoy') && (
                        <span className="text-amber-600">ℹ️ For best results, use Polygon Amoy testnet (Chain ID: 80002)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleGrantRole}
                    disabled={isGranting || !selectedAddress || !selectedRole || !isConnected}
                    className="flex-1"
                    title={!isConnected ? 'Connect wallet first' : 'Grant blockchain role'}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {isGranting ? 'Granting...' : 'Grant Role'}
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleRevokeRole}
                    disabled={isRevoking || !selectedAddress || !selectedRole || !isConnected}
                    className="flex-1"
                    title={!isConnected ? 'Connect wallet first' : 'Revoke blockchain role'}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    {isRevoking ? 'Revoking...' : 'Revoke Role'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Available Roles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Available Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Admin', description: 'Full platform control', badge: 'destructive' },
                    { name: 'Manager', description: 'Manage tiers and settings', badge: 'default' },
                    { name: 'Artist', description: 'Upload tracks and content', badge: 'secondary' },
                    { name: 'Oracle', description: 'Update streaming stats', badge: 'outline' }
                  ].map((role) => (
                    <div key={role.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{role.name}</h4>
                        <Badge variant={role.badge as any}>{role.name}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Transaction Troubleshooting
                  </h4>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                    <p><strong>If MetaMask transactions fail:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ensure you have MATIC tokens for gas fees</li>
                      <li>Get testnet MATIC from: <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">https://faucet.polygon.technology/</a></li>
                      <li>Check that you're connected to Polygon Amoy testnet</li>
                      <li>Try increasing gas limit manually in MetaMask</li>
                      <li>Clear MetaMask activity tab and retry</li>
                      <li>Use "Quick Approve" first, then grant roles manually</li>
                    </ul>
                    <p className="text-xs italic">Network: Polygon Amoy (Chain ID: 80002) • Currency: MATIC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Artist Detail Modal/Rejection Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Artist Application Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArtist(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {/* Artist Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedArtist.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg">
                      {selectedArtist.display_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold">{selectedArtist.display_name}</h4>
                    <p className="text-muted-foreground">{selectedArtist.bio}</p>
                    <div className="text-sm font-mono text-muted-foreground mt-2">
                      {selectedArtist.wallet_address}
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Provide feedback to the artist..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleApproveArtist(selectedArtist)}
                    disabled={isApproving}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {isApproving ? 'Approving...' : 'Approve Artist'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectArtist(selectedArtist)}
                    disabled={isRejecting}
                    className="flex-1"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    {isRejecting ? 'Rejecting...' : 'Reject Application'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}