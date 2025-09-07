import { Badge } from '@/src/components/ui/badge'
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
import { useAdminData } from '@/src/hooks/useAdminData'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Coins,
  ExternalLink,
  Search,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'

export function BlockchainMonitoring() {
  const { transactions } = useAdminData()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'mint' | 'sale' | 'transfer' | 'royalty_payment' | 'token_swap'
  >('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed'>(
    'all',
  )

  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.nftId?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.status === statusFilter)
    }

    return filtered
  }, [transactions, searchQuery, typeFilter, statusFilter])

  const getTransactionStats = () => {
    const last24h = transactions.filter(
      (tx) => tx.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000,
    )

    return {
      total: transactions.length,
      pending: transactions.filter((tx) => tx.status === 'pending').length,
      confirmed: transactions.filter((tx) => tx.status === 'confirmed').length,
      failed: transactions.filter((tx) => tx.status === 'failed').length,
      volume24h: last24h
        .filter((tx) => tx.type === 'sale' && tx.status === 'confirmed')
        .reduce((sum, tx) => sum + tx.value, 0),
      avgGasPrice:
        transactions
          .filter((tx) => tx.status === 'confirmed')
          .reduce((sum, tx) => sum + tx.gasPrice, 0) /
        transactions.filter((tx) => tx.status === 'confirmed').length,
    }
  }

  const stats = getTransactionStats()

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mint':
        return 'bg-blue-500'
      case 'sale':
        return 'bg-green-500'
      case 'transfer':
        return 'bg-purple-500'
      case 'royalty_payment':
        return 'bg-orange-500'
      case 'token_swap':
        return 'bg-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Txs</p>
                </div>
                <Activity className="w-6 h-6 text-blue-500" />
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
                  <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-500" />
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
                  <p className="text-xl font-bold text-green-600">{stats.confirmed}</p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
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
                  <p className="text-xl font-bold text-red-600">{stats.failed}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
                <AlertCircle className="w-6 h-6 text-red-500" />
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
                  <p className="text-xl font-bold text-purple-600">{stats.volume24h.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-orange-600">
                    {stats.avgGasPrice.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Gas</p>
                </div>
                <Coins className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transaction Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Transaction Monitoring</CardTitle>
          <CardDescription>
            Monitor all blockchain transactions and their status in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by hash, address, or NFT ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(value: string) => setTypeFilter(value as typeof typeFilter)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="royalty_payment">Royalty Payment</SelectItem>
                <SelectItem value="token_swap">Token Swap</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value: string) => setStatusFilter(value as typeof statusFilter)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Gas</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.slice(0, 50).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-mono text-sm">{formatAddress(tx.hash)}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>From: {formatAddress(tx.from)}</span>
                          <ArrowUpRight className="w-3 h-3" />
                          <span>To: {formatAddress(tx.to)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getTypeColor(tx.type)}`} />
                        <Badge variant="outline">{tx.type.replace('_', ' ')}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <Badge
                          variant={
                            tx.status === 'confirmed'
                              ? 'default'
                              : tx.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <p className="font-mono">{tx.value.toFixed(4)}</p>
                        <p className="text-xs text-muted-foreground">{tx.tokenSymbol}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <p className="font-mono text-sm">{(tx.gasUsed / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.gasPrice.toFixed(0)} gwei
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-sm">{tx.blockNumber.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(tx.timestamp)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 hover:bg-accent rounded"
                          onClick={() =>
                            window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length > 50 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing first 50 of {filteredTransactions.length} transactions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
