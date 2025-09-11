/**
 * Contract Debug Button Component
 * Quick access button to debug contract status
 */

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { debugContractStatus } from '@/src/utils/contractVerification'

export function ContractDebugButton() {
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugResult, setDebugResult] = useState<any>(null)

  const handleDebug = async () => {
    setIsDebugging(true)
    try {
      console.log('🔍 Starting contract debug...')
      const result = await debugContractStatus()
      setDebugResult(result)
      console.log('✅ Debug complete:', result)
    } catch (error) {
      console.error('❌ Debug failed:', error)
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsDebugging(false)
    }
  }

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="flex items-center gap-4 mb-2">
        <Button 
          onClick={handleDebug}
          disabled={isDebugging}
          variant="outline"
          size="sm"
        >
          {isDebugging ? 'Debugging...' : '🔍 Debug Contract'}
        </Button>
        <span className="text-sm text-gray-600">
          Check MusicNFT contract deployment & functionality
        </span>
      </div>
      
      {debugResult && (
        <div className="mt-3 p-3 bg-gray-100 rounded text-xs font-mono">
          <div className="font-bold mb-2">Debug Results:</div>
          <div>Deployed: {debugResult.isDeployed ? '✅ Yes' : '❌ No'}</div>
          <div>Has Code: {debugResult.hasCode ? '✅ Yes' : '❌ No'}</div>
          <div>Has Role Function: {debugResult.hasRoleFunction ? '✅ Yes' : '❌ No'}</div>
          {debugResult.error && (
            <div className="text-red-600 mt-2">Error: {debugResult.error}</div>
          )}
          <div className="mt-2 text-gray-500">
            Check browser console for detailed logs
          </div>
        </div>
      )}
    </div>
  )
}

