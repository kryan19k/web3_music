/**
 * Quick Role Grant Component
 * One-click solution to grant ARTIST_ROLE to the specific address
 */

import React from 'react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useAdminGrantRole } from '@/src/hooks/contracts/useAdminContract'
import { toast } from 'sonner'
import { Shield, Check } from 'lucide-react'

export function QuickRoleGrant() {
  const { grantRole, isLoading, isSuccess } = useAdminGrantRole()
  
  const TARGET_ADDRESS = '0x53B7796D35fcD7fE5D31322AaE8469046a2bB034'
  const ARTIST_ROLE_HASH = '0x877a78dc988c0ec5f58453b44888a55eb39755c3d5ed8d8ea990912aa3ef29c6'
  
  const handleGrantRole = () => {
    console.log('🚀 Granting ARTIST_ROLE to:', TARGET_ADDRESS)
    grantRole({
      role: ARTIST_ROLE_HASH,
      account: TARGET_ADDRESS as `0x${string}`
    })
  }
  
  if (isSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800">Role Granted Successfully!</h3>
          <p className="text-green-700 mt-2">
            ARTIST_ROLE has been granted to {TARGET_ADDRESS}
          </p>
          <p className="text-sm text-green-600 mt-2">
            You can now try the artist signup flow again.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Grant ARTIST_ROLE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            <strong>Address:</strong> {TARGET_ADDRESS}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Role:</strong> ARTIST_ROLE
          </p>
        </div>
        
        <Button 
          onClick={handleGrantRole}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Granting Role...' : 'Grant ARTIST_ROLE'}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          This will grant the ARTIST_ROLE to your wallet on the deployed smart contract.
        </p>
      </CardContent>
    </Card>
  )
}
