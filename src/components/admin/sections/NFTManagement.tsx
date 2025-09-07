import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'
import { Textarea } from '@/src/components/ui/textarea'
import { useAdminData } from '@/src/hooks/useAdminData'
import { motion } from 'framer-motion'
import { AlertTriangle, Check, Clock, Eye, Flag, Music, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

export function NFTManagement() {
  const { nfts, approveNFT, rejectNFT, flagNFT } = useAdminData()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected' | 'flagged'
  >('all')
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [flagReasons, setFlagReasons] = useState<string[]>([])

  const filteredNFTs = useMemo(() => {
    let filtered = nfts

    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.tokenId.includes(searchQuery),
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((nft) => nft.status === statusFilter)
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [nfts, searchQuery, statusFilter])

  const getNFTStats = () => {
    return {
      total: nfts.length,
      pending: nfts.filter((n) => n.status === 'pending').length,
      approved: nfts.filter((n) => n.status === 'approved').length,
      rejected: nfts.filter((n) => n.status === 'rejected').length,
      flagged: nfts.filter((n) => n.status === 'flagged').length,
    }
  }

  const stats = getNFTStats()

  const handleApprove = (nftId: string) => {
    approveNFT(nftId)
    setSelectedNFT(null)
  }

  const handleReject = (nftId: string) => {
    if (rejectReason.trim()) {
      rejectNFT(nftId, rejectReason)
      setRejectReason('')
      setSelectedNFT(null)
    }
  }

  const handleFlag = (nftId: string) => {
    if (flagReasons.length > 0) {
      flagNFT(nftId, flagReasons)
      setFlagReasons([])
      setSelectedNFT(null)
    }
  }

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      case 'flagged':
        return 'bg-orange-500'
      case 'pending':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* NFT Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total NFTs</p>
                </div>
                <Music className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
                <X className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.flagged}</p>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                </div>
                <Flag className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* NFT Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>NFT Content Moderation</CardTitle>
          <CardDescription>Review, approve, reject, and moderate NFT content</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: string) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NFTs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NFT</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNFTs.slice(0, 20).map((nft) => (
                  <TableRow key={nft.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{nft.title}</p>
                          <p className="text-sm text-muted-foreground">Token #{nft.tokenId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{nft.artist}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(nft.status)}`} />
                        <Badge
                          variant={
                            nft.status === 'approved'
                              ? 'default'
                              : nft.status === 'pending'
                                ? 'secondary'
                                : nft.status === 'flagged'
                                  ? 'destructive'
                                  : 'outline'
                          }
                        >
                          {nft.status}
                        </Badge>
                      </div>
                      {nft.flaggedReasons && (
                        <div className="mt-1">
                          <p className="text-xs text-orange-600">{nft.flaggedReasons.join(', ')}</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>${nft.currentPrice.toFixed(2)}</TableCell>
                    <TableCell>{nft.totalSales}</TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(nft.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {nft.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(nft.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setSelectedNFT(nft.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {(nft.status === 'approved' || nft.status === 'pending') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedNFT(nft.id)}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredNFTs.length > 20 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing first 20 of {filteredNFTs.length} NFTs
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Actions Modal */}
      {selectedNFT && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Moderation Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Reject */}
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">Reject NFT</h4>
                <Textarea
                  placeholder="Reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedNFT)}
                  disabled={!rejectReason.trim()}
                  className="w-full"
                >
                  Reject
                </Button>
              </div>

              {/* Flag */}
              <div className="space-y-3">
                <h4 className="font-medium text-orange-600">Flag NFT</h4>
                <div className="space-y-2">
                  {[
                    'Copyright violation',
                    'Inappropriate content',
                    'Spam',
                    'Low quality',
                    'Misleading',
                  ].map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={flagReasons.includes(reason)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFlagReasons([...flagReasons, reason])
                          } else {
                            setFlagReasons(flagReasons.filter((r) => r !== reason))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{reason}</span>
                    </label>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleFlag(selectedNFT)}
                  disabled={flagReasons.length === 0}
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
                >
                  Flag
                </Button>
              </div>

              {/* Approve */}
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">Approve NFT</h4>
                <p className="text-sm text-muted-foreground">
                  Approve this NFT for public listing on the marketplace.
                </p>
                <Button
                  variant="default"
                  onClick={() => handleApprove(selectedNFT)}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Approve
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedNFT(null)
                  setRejectReason('')
                  setFlagReasons([])
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
