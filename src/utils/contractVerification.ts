/**
 * Contract Verification Utility
 * Check if the deployed contract matches our expectations
 */

import { createPublicClient, http, getContract } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { MusicNFTAbi } from '@/src/constants/contracts/abis/MusicNFT'
import { CONTRACT_ADDRESSES } from '@/src/constants/contracts/contracts'

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http('https://rpc-amoy.polygon.technology/'),
})

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES[80002].MusicNFT

/**
 * Verify the contract exists and has expected functions
 */
export async function verifyContractDeployment() {
  console.log('🔍 Verifying contract at:', CONTRACT_ADDRESS)
  
  try {
    // 1. Check if contract exists (has code)
    const code = await publicClient.getCode({ address: CONTRACT_ADDRESS })
    
    if (!code || code === '0x') {
      console.error('❌ Contract not deployed! No code at address:', CONTRACT_ADDRESS)
      return {
        deployed: false,
        error: 'No contract code at address'
      }
    }
    
    console.log('✅ Contract has code deployed')
    
    // 2. Test basic contract reads
    const contract = getContract({
      address: CONTRACT_ADDRESS,
      abi: MusicNFTAbi,
      client: publicClient,
    })
    
    // Test some basic functions that should exist
    const tests = []
    
    // Note: ERC1155 contracts don't have a name() function like ERC721/ERC20
    // Skip name() test for MusicNFT contract
    
    // Test totalSupply() function
    try {
      const totalSupply = await contract.read.totalSupply()
      console.log('✅ Total supply:', totalSupply.toString())
      tests.push({ function: 'totalSupply', success: true, result: totalSupply.toString() })
    } catch (error) {
      console.error('❌ totalSupply() failed:', error)
      tests.push({ function: 'totalSupply', success: false, error: error.message })
    }
    
    // Test ARTIST_ROLE() function
    try {
      const artistRole = await contract.read.ARTIST_ROLE()
      console.log('✅ ARTIST_ROLE hash:', artistRole)
      tests.push({ function: 'ARTIST_ROLE', success: true, result: artistRole })
    } catch (error) {
      console.error('❌ ARTIST_ROLE() failed:', error)
      tests.push({ function: 'ARTIST_ROLE', success: false, error: error.message })
    }
    
    // Test if addTrack function exists in ABI
    const addTrackFunction = MusicNFTAbi.find((item: any) => item.name === 'addTrack')
    if (addTrackFunction) {
      console.log('✅ addTrack function found in ABI')
      tests.push({ function: 'addTrack (ABI)', success: true, result: 'Function exists in ABI' })
    } else {
      console.error('❌ addTrack function NOT found in ABI!')
      tests.push({ function: 'addTrack (ABI)', success: false, error: 'Function not in ABI' })
    }
    
    return {
      deployed: true,
      contractAddress: CONTRACT_ADDRESS,
      tests,
      codeLength: code.length
    }
    
  } catch (error) {
    console.error('❌ Contract verification failed:', error)
    return {
      deployed: false,
      error: error.message,
      contractAddress: CONTRACT_ADDRESS
    }
  }
}

/**
 * Test role verification for a specific address
 */
export async function verifyArtistRole(address: `0x${string}`): Promise<{
  hasRole: boolean
  roleHash: string
  error?: string
}> {
  const ARTIST_ROLE_HASH = '0x877a78dc988c0ec5f58453b44888a55eb39755c3d5ed8d8ea990912aa3ef29c6'
  
  try {
    console.log('🎭 Verifying ARTIST_ROLE for address:', address)
    console.log('Using role hash:', ARTIST_ROLE_HASH)
    
    const contract = getContract({
      address: CONTRACT_ADDRESS,
      abi: MusicNFTAbi,
      client: publicClient,
    })
    
    const hasRole = await contract.read.hasRole([ARTIST_ROLE_HASH, address])
    
    console.log('Role check result:', hasRole)
    
    return {
      hasRole: hasRole as boolean,
      roleHash: ARTIST_ROLE_HASH
    }
    
  } catch (error) {
    console.error('❌ Role verification failed:', error)
    return {
      hasRole: false,
      roleHash: ARTIST_ROLE_HASH,
      error: error.message
    }
  }
}

/**
 * Debug contract status - call this from console
 */
export async function debugContractStatus() {
  console.log('🔍 === CONTRACT DEBUG REPORT ===')
  
  const verification = await verifyContractDeployment()
  console.log('Contract verification result:', verification)
  
  const roleCheck = await verifyArtistRole('0x53B7796D35fcD7fE5D31322AaE8469046a2bB034')
  console.log('Role verification result:', roleCheck)
  
  console.log('🔍 === END DEBUG REPORT ===')
  
  return {
    contract: verification,
    role: roleCheck
  }
}