/**
 * Contract Debug Component
 * Quick way to verify contract deployment and functions
 */

import React, { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { AlertCircle, CheckCircle, Search, RefreshCw } from 'lucide-react'
import { verifyContractDeployment, verifyArtistRole, debugContractStatus } from '@/src/utils/contractVerification'

interface ContractTest {
  function: string
  success: boolean
  result?: string
  error?: string
}

interface VerificationResult {
  deployed: boolean
  contractAddress?: string
  tests?: ContractTest[]
  codeLength?: number
  error?: string
}

export function ContractDebug() {
  const [isLoading, setIsLoading] = useState(false)
  const [verification, setVerification] = useState<VerificationResult | null>(null)
  const [roleCheck, setRoleCheck] = useState<any>(null)
  
  const handleVerify = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Starting contract verification...')
      
      const contractResult = await verifyContractDeployment()
      setVerification(contractResult)
      
      const roleResult = await verifyArtistRole('0x53B7796D35fcD7fE5D31322AaE8469046a2bB034')
      setRoleCheck(roleResult)
      
      console.log('✅ Verification complete')
      
    } catch (error) {
      console.error('❌ Verification failed:', error)
      setVerification({
        deployed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Contract Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleVerify}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isLoading ? 'Verifying...' : 'Verify Contract'}
          </Button>
        </div>
        
        {verification && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {verification.deployed ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Contract Deployed</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Contract Not Deployed</span>
                </>
              )}
            </div>
            
            {verification.contractAddress && (
              <div className="text-sm text-muted-foreground">
                <strong>Address:</strong> {verification.contractAddress}
              </div>
            )}
            
            {verification.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{verification.error}</p>
              </div>
            )}
            
            {verification.tests && (
              <div className="space-y-2">
                <h4 className="font-medium">Function Tests:</h4>
                {verification.tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">{test.function}</span>
                    <Badge variant={test.success ? "default" : "destructive"}>
                      {test.success ? 'Pass' : 'Fail'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {roleCheck && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Role Check:</h4>
            <div className="flex items-center gap-2">
              {roleCheck.hasRole ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 text-sm">ARTIST_ROLE granted</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800 text-sm">ARTIST_ROLE not granted</span>
                </>
              )}
            </div>
            {roleCheck.error && (
              <p className="text-red-600 text-xs mt-1">{roleCheck.error}</p>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          This tool verifies the deployed contract has the expected functions and checks role permissions.
        </div>
      </CardContent>
    </Card>
  )
}

