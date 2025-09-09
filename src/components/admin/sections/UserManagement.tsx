import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Users, Shield, Search, UserCheck, UserX } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  useAdminContractData,
  useAdminGrantRole,
  useAdminRevokeRole
} from '@/src/hooks/contracts'

export function UserManagement() {
  const { roleInfo, isAuthorized } = useAdminContractData()
  const { grantRole, isLoading: isGranting } = useAdminGrantRole()
  const { revokeRole, isLoading: isRevoking } = useAdminRevokeRole()

  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

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
    if (!selectedAddress || !selectedRole) return
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

  return (
    <div className="space-y-6">
      {/* Role Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Management
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value={roleInfo.roles.manager}>Manager</option>
                  <option value={roleInfo.roles.artist}>Artist</option>
                  <option value={roleInfo.roles.oracle}>Oracle</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGrantRole}
                disabled={isGranting || !selectedAddress || !selectedRole}
                className="flex-1"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {isGranting ? 'Granting...' : 'Grant Role'}
              </Button>
              <Button 
                variant="destructive"
                onClick={handleRevokeRole}
                disabled={isRevoking || !selectedAddress || !selectedRole}
                className="flex-1"
              >
                <UserX className="h-4 w-4 mr-2" />
                {isRevoking ? 'Revoking...' : 'Revoke Role'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Search & Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">User Management Coming Soon</h3>
              <p className="text-muted-foreground">
                This section will show user statistics, verification status, and activity monitoring.
                For now, use the role management above to grant/revoke permissions.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}