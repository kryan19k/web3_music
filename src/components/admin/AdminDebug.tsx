import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { Shield, User, AlertCircle, CheckCircle } from 'lucide-react'
import { 
  useAdminContractData,
  useAdminGrantRole,
  useAdminRoleInfo
} from '@/src/hooks/contracts'

export function AdminDebug() {
  const { address, isConnected } = useAccount()
  const { platformStats, roleInfo, isLoading } = useAdminContractData()
  const { grantRole, reset: resetGrantRole, isLoading: isGranting } = useAdminGrantRole()
  const roleData = useAdminRoleInfo(address)

  const handleGrantSelfAdmin = () => {
    if (!address || !roleInfo.roles.admin) return
    grantRole({ 
      role: roleInfo.roles.admin, 
      account: address 
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to access admin functions.</p>
        </div>
      </div>
    )
  }

  if (isLoading || roleData.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading contract data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Admin Access Debug
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Access Denied - Debugging Information
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Your wallet doesn't have admin or manager privileges. Use the information below to debug.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Wallet Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Connected Address</label>
                  <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                    {address || 'Not connected'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Connection Status</label>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="default">Connected</Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive">Not Connected</Badge>
                      </>
                    )}
                  </div>
                </div>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Has Admin Role</label>
                  <div className="flex items-center gap-2">
                    {roleInfo.userRoles.isAdmin ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="default">Yes</Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive">No</Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Has Manager Role</label>
                  <div className="flex items-center gap-2">
                    {roleInfo.userRoles.isManager ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="default">Yes</Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive">No</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Available Role Hashes</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-2 bg-muted rounded text-xs font-mono">
                    <strong>ADMIN:</strong> {roleInfo.roles.admin || 'Loading...'}
                  </div>
                  <div className="p-2 bg-muted rounded text-xs font-mono">
                    <strong>MANAGER:</strong> {roleInfo.roles.manager || 'Loading...'}
                  </div>
                  <div className="p-2 bg-muted rounded text-xs font-mono">
                    <strong>ARTIST:</strong> {roleInfo.roles.artist || 'Loading...'}
                  </div>
                </div>
                
                {/* Debug information */}
                <div className="p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-xs">
                  <strong>Debug:</strong>
                  <br />Role data loading: {roleData.isLoading ? 'Yes' : 'No'}
                  <br />Platform stats loading: {isLoading ? 'Yes' : 'No'}
                  <br />Admin role value: {JSON.stringify(roleInfo.roles.admin)}
                  <br />Button disabled because: {!roleInfo.roles.admin ? 'Admin role hash not loaded' : 'Unknown'}
                </div>
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
            <CardHeader>
              <CardTitle>Grant Admin Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  For Contract Deployer
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  If you deployed this contract, you should have the default admin role. 
                  Try granting yourself admin access:
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={handleGrantSelfAdmin}
                    disabled={isGranting || !roleInfo.roles.admin}
                  >
                    {isGranting ? 'Granting...' : 'Grant Self Admin Role'}
                  </Button>
                  
                  {!roleInfo.roles.admin && (
                    <Button 
                      onClick={() => {
                        if (!address) return
                        // DEFAULT_ADMIN_ROLE is 0x00 in OpenZeppelin
                        grantRole({ 
                          role: '0x0000000000000000000000000000000000000000000000000000000000000000', 
                          account: address 
                        })
                      }}
                      disabled={isGranting}
                      variant="outline"
                    >
                      {isGranting ? 'Granting...' : 'Grant Admin (Manual Fallback)'}
                    </Button>
                  )}
                  
                  {isGranting && (
                    <Button 
                      onClick={() => resetGrantRole()}
                      variant="destructive"
                      size="sm"
                    >
                      Cancel Transaction
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  If the first button is disabled, try the fallback button below it.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                  If You're Not The Deployer
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  You need to ask the contract deployer to grant you admin or manager privileges using the UserManagement section.
                </p>
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
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="font-medium">Polygon Amoy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chain ID:</span>
                    <span className="font-medium">80002</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract Status:</span>
                    <span className="font-medium">
                      {platformStats.isPaused ? 'Paused' : 'Active'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Supply:</span>
                    <span className="font-medium">{Number(platformStats.totalSupply).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span className="font-medium">{Number(platformStats.platformFeePercentage) / 100}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
