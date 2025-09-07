import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
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
import { useAdminData } from '@/src/hooks/useAdminData'
import { motion } from 'framer-motion'
import {
  Ban,
  CheckCircle,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'

export function UserManagement() {
  const { users, banUser, unbanUser, verifyUser } = useAdminData()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'unverified'>(
    'all',
  )
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'artist' | 'verified_artist'>('all')

  const filteredUsers = useMemo(() => {
    let filtered = users

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => {
        switch (statusFilter) {
          case 'active':
            return !user.isBanned
          case 'banned':
            return user.isBanned
          case 'unverified':
            return !user.isVerified
          default:
            return true
        }
      })
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    return filtered
  }, [users, searchQuery, statusFilter, roleFilter])

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter((u) => !u.isBanned).length,
      banned: users.filter((u) => u.isBanned).length,
      verified: users.filter((u) => u.isVerified).length,
      artists: users.filter((u) => u.role === 'artist' || u.role === 'verified_artist').length,
    }
  }

  const stats = getUserStats()

  return (
    <div className="space-y-6">
      {/* User Stats */}
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
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
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
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
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
                  <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
                  <p className="text-sm text-muted-foreground">Banned</p>
                </div>
                <UserX className="w-8 h-8 text-red-500" />
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
                  <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
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
                  <p className="text-2xl font-bold text-purple-600">{stats.artists}</p>
                  <p className="text-sm text-muted-foreground">Artists</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, permissions, and moderation</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={roleFilter}
              onValueChange={(value: string) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="verified_artist">Verified Artist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>NFTs</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.slice(0, 20).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === 'verified_artist'
                            ? 'default'
                            : user.role === 'artist'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.isBanned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge
                            variant="default"
                            className="bg-green-500"
                          >
                            Active
                          </Badge>
                        )}
                        {user.isVerified && <Shield className="w-4 h-4 text-blue-500" />}
                      </div>
                    </TableCell>
                    <TableCell>{user.totalNFTs}</TableCell>
                    <TableCell>${user.totalEarnings.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(user.lastActive)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.isBanned ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => unbanUser(user.id)}
                          >
                            Unban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => banUser(user.id)}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}

                        {!user.isVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyUser(user.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length > 20 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing first 20 of {filteredUsers.length} users
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
