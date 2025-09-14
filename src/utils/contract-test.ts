/**
 * Utility functions to test V2 contract connectivity and data
 */

import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { COLLECTION_MUSIC_NFT_V2_ABI } from '@/src/constants/contracts/abis/CollectionMusicNFTV2'
import { CONTRACTS } from '@/src/constants/contracts/contracts'

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http('https://rpc-amoy.polygon.technology/')
})

/**
 * Test basic contract connectivity
 */
export async function testContractConnectivity() {
  try {
    console.log('🔍 Testing V2 contract connectivity...')
    console.log('Contract Address:', CONTRACTS.CollectionMusicNFT.address)

    // Test if contract exists by checking bytecode
    const code = await publicClient.getBytecode({
      address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
    })

    if (!code || code === '0x') {
      console.error('❌ No contract found at address:', CONTRACTS.CollectionMusicNFT.address)
      return false
    }

    console.log('✅ Contract exists at address:', CONTRACTS.CollectionMusicNFT.address)
    console.log('📝 Bytecode length:', code.length)

    return true
  } catch (error) {
    console.error('❌ Error testing contract connectivity:', error)
    return false
  }
}

/**
 * Test reading collection data
 */
export async function testCollectionReading() {
  try {
    console.log('🔍 Testing collection reading...')

    // Try to read collection 1
    const collectionData = await publicClient.readContract({
      address: CONTRACTS.CollectionMusicNFT.address as `0x${string}`,
      abi: COLLECTION_MUSIC_NFT_V2_ABI,
      functionName: 'collections',
      args: [BigInt(1)],
    })

    console.log('✅ Successfully read collection 1:', collectionData)
    return collectionData
  } catch (error) {
    console.log('📝 No collection at index 1 (this is expected for fresh contracts)')
    console.log('Error details:', error)
    return null
  }
}

/**
 * Run all contract tests
 */
export async function runContractTests() {
  console.log('🧪 Running V2 contract tests...')

  const isConnected = await testContractConnectivity()
  if (!isConnected) {
    console.error('❌ Contract connectivity failed')
    return false
  }

  const collectionData = await testCollectionReading()

  console.log('📊 Test Summary:')
  console.log('- Contract exists:', isConnected)
  console.log('- Collections found:', collectionData ? 'Yes' : 'No (expected for fresh deployment)')

  return true
}

/**
 * Test function to call from browser console
 * Usage: import { runContractTests } from '@/src/utils/contract-test'; runContractTests()
 */
if (typeof window !== 'undefined') {
  // Make available in browser console
  (window as any).testV2Contract = runContractTests
  console.log('🔧 V2 contract test utility loaded. Run testV2Contract() in console to test.')
}