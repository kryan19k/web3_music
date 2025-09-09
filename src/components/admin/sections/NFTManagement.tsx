import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Badge } from '@/src/components/ui/badge'
import { Switch } from '@/src/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { 
  Music, 
  Settings, 
  Edit3, 
  Plus,
  BarChart3,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Upload,
  Play
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatEther } from 'viem'
import { 
  useMusicNFTAllTiers,
  useAdminUpdateTierConfig,
  useMusicNFTAddTrack,
  useAdminUpdateTrackStats,
  useAdminContractData,
  Tier,
  getTierName,
  getTierColors
} from '@/src/hooks/contracts'

export function NFTManagement() {
  const { roleInfo, isLoading: isLoadingAuth } = useAdminContractData()
  const { tiers, isLoading: isLoadingTiers } = useMusicNFTAllTiers()
  const { updateTierConfig, isLoading: isUpdatingTier } = useAdminUpdateTierConfig()
  const { addTrack, isLoading: isAddingTrack } = useMusicNFTAddTrack()
  const { updateTrackStats, isLoading: isUpdatingStats } = useAdminUpdateTrackStats()

  // Tier management state
  const [selectedTier, setSelectedTier] = useState<Tier>(Tier.BRONZE)
  const [tierPrice, setTierPrice] = useState('')
  const [tierActive, setTierActive] = useState(false)
  const [tierMetadataURI, setTierMetadataURI] = useState('')

  // Track management state
  const [trackData, setTrackData] = useState({
    trackId: '',
    title: '',
    artist: '',
    album: '',
    ipfsAudioHash: '',
    ipfsCoverArt: '',
    duration: '',
    bpm: '',
    genre: ''
  })

  // Track stats state
  const [statsData, setStatsData] = useState({
    trackId: '',
    streams: '',
    royalties: ''
  })

  const handleUpdateTier = () => {
    if (!tierPrice) return
    
    updateTierConfig({
      tier: selectedTier,
      price: tierPrice,
      saleActive: tierActive,
      metadataURI: tierMetadataURI
    })
    
    // Reset form
    setTierPrice('')
    setTierMetadataURI('')
  }

  const handleAddTrack = () => {
    const { trackId, title, artist, album, ipfsAudioHash, ipfsCoverArt, duration, bpm, genre } = trackData
    
    if (!trackId || !title || !artist || !ipfsAudioHash) return
    
    addTrack({
      trackId: Number.parseInt(trackId),
      title,
      artist,
      album,
      ipfsAudioHash,
      ipfsCoverArt,
      duration: Number.parseInt(duration) || 0,
      bpm: Number.parseInt(bpm) || 0,
      genre
    })
    
    // Reset form
    setTrackData({
      trackId: '',
      title: '',
      artist: '',
      album: '',
      ipfsAudioHash: '',
      ipfsCoverArt: '',
      duration: '',
      bpm: '',
      genre: ''
    })
  }

  const handleUpdateStats = () => {
    const { trackId, streams, royalties } = statsData
    
    if (!trackId || !streams) return
    
    updateTrackStats({
      trackId: Number.parseInt(trackId),
      streams: Number.parseInt(streams),
      royalties: royalties || '0'
    })
    
    // Reset form
    setStatsData({
      trackId: '',
      streams: '',
      royalties: ''
    })
  }

  if (!roleInfo.userRoles.isAdmin && !roleInfo.userRoles.isManager) {
    return (
      <div className="text-center py-8">
        <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Manager Access Required</h3>
        <p className="text-muted-foreground">
          You need manager or admin privileges to manage NFTs.
        </p>
      </div>
    )
  }

  if (isLoadingAuth || isLoadingTiers) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading NFT management...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tiers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tiers">Tier Management</TabsTrigger>
          <TabsTrigger value="tracks">Track Management</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Tier Management Tab */}
        <TabsContent value="tiers" className="space-y-6">
          {/* Current Tiers Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Current Tier Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.values(Tier).filter(tier => typeof tier === 'number').map(tier => {
                    const tierData = tiers[tier as Tier]
                    const colors = getTierColors(tier as Tier)
                    
                    if (!tierData) return null
                    
                    const mintedPercent = tierData.maxSupply > 0 
                      ? (tierData.currentSupply / tierData.maxSupply) * 100 
                      : 0

                    return (
                      <Card key={tier} className="border-2">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{getTierName(tier as Tier)}</CardTitle>
                            <Badge 
                              variant={tierData.saleActive ? "default" : "secondary"}
                              className={tierData.saleActive ? colors.primary : ''}
                            >
                              {tierData.saleActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span>Price:</span>
                              <span className="font-medium">
                                {Number.parseFloat(formatEther(tierData.price || 0n)).toFixed(4)} ETH
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Minted:</span>
                              <span className="font-medium">
                                {tierData.currentSupply || 0} / {tierData.maxSupply || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Progress:</span>
                              <span className="font-medium">{mintedPercent.toFixed(1)}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tier Configuration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Update Tier Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Tier</Label>
                    <Select 
                      value={selectedTier.toString()} 
                      onValueChange={(value) => setSelectedTier(Number.parseInt(value) as Tier)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Tier).filter(tier => typeof tier === 'number').map(tier => (
                          <SelectItem key={tier} value={tier.toString()}>
                            {getTierName(tier as Tier)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tier-price">Price (ETH)</Label>
                    <Input
                      id="tier-price"
                      type="number"
                      step="0.0001"
                      placeholder="0.1"
                      value={tierPrice}
                      onChange={(e) => setTierPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metadata-uri">Metadata URI</Label>
                  <Input
                    id="metadata-uri"
                    placeholder="https://ipfs.io/ipfs/..."
                    value={tierMetadataURI}
                    onChange={(e) => setTierMetadataURI(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={tierActive}
                    onCheckedChange={setTierActive}
                  />
                  <Label>Enable Sale for this tier</Label>
                </div>

                <Button 
                  onClick={handleUpdateTier}
                  disabled={isUpdatingTier || !tierPrice}
                  className="w-full"
                >
                  {isUpdatingTier ? 'Updating...' : 'Update Tier Configuration'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Track Management Tab */}
        <TabsContent value="tracks" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Track
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="track-id">Track ID</Label>
                    <Input
                      id="track-id"
                      type="number"
                      placeholder="1"
                      value={trackData.trackId}
                      onChange={(e) => setTrackData(prev => ({ ...prev, trackId: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="track-title">Title</Label>
                    <Input
                      id="track-title"
                      placeholder="Song Title"
                      value={trackData.title}
                      onChange={(e) => setTrackData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="track-artist">Artist</Label>
                    <Input
                      id="track-artist"
                      placeholder="Artist Name"
                      value={trackData.artist}
                      onChange={(e) => setTrackData(prev => ({ ...prev, artist: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="track-album">Album</Label>
                    <Input
                      id="track-album"
                      placeholder="Album Name"
                      value={trackData.album}
                      onChange={(e) => setTrackData(prev => ({ ...prev, album: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audio-hash">IPFS Audio Hash</Label>
                    <Input
                      id="audio-hash"
                      placeholder="QmXXXXXXXXXXXXXXXXXXXX"
                      value={trackData.ipfsAudioHash}
                      onChange={(e) => setTrackData(prev => ({ ...prev, ipfsAudioHash: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover-hash">IPFS Cover Art Hash</Label>
                    <Input
                      id="cover-hash"
                      placeholder="QmYYYYYYYYYYYYYYYYYYYY"
                      value={trackData.ipfsCoverArt}
                      onChange={(e) => setTrackData(prev => ({ ...prev, ipfsCoverArt: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="180"
                      value={trackData.duration}
                      onChange={(e) => setTrackData(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bpm">BPM</Label>
                    <Input
                      id="bpm"
                      type="number"
                      placeholder="120"
                      value={trackData.bpm}
                      onChange={(e) => setTrackData(prev => ({ ...prev, bpm: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    placeholder="Electronic, Pop, Hip-Hop, etc."
                    value={trackData.genre}
                    onChange={(e) => setTrackData(prev => ({ ...prev, genre: e.target.value }))}
                  />
                </div>

                <Button 
                  onClick={handleAddTrack}
                  disabled={isAddingTrack || !trackData.trackId || !trackData.title || !trackData.artist}
                  className="w-full"
                >
                  {isAddingTrack ? 'Adding Track...' : 'Add Track'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Update Track Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stats-track-id">Track ID</Label>
                    <Input
                      id="stats-track-id"
                      type="number"
                      placeholder="1"
                      value={statsData.trackId}
                      onChange={(e) => setStatsData(prev => ({ ...prev, trackId: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streams">Total Streams</Label>
                    <Input
                      id="streams"
                      type="number"
                      placeholder="10000"
                      value={statsData.streams}
                      onChange={(e) => setStatsData(prev => ({ ...prev, streams: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="royalties">Royalties Generated (ETH)</Label>
                    <Input
                      id="royalties"
                      type="number"
                      step="0.0001"
                      placeholder="0.5"
                      value={statsData.royalties}
                      onChange={(e) => setStatsData(prev => ({ ...prev, royalties: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleUpdateStats}
                  disabled={isUpdatingStats || !statsData.trackId || !statsData.streams}
                  className="w-full"
                >
                  {isUpdatingStats ? 'Updating...' : 'Update Track Statistics'}
                </Button>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Oracle Role Required
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Track statistics are typically updated by oracle services based on real streaming data. 
                    Manual updates should only be used for testing or corrections.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}