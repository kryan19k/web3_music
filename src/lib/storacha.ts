/**
 * Storacha IPFS Client
 * Decentralized file storage with IPFS and Filecoin
 */

import * as Client from '@storacha/client'
import { StoreMemory } from '@storacha/client/stores/memory'
import * as Proof from '@storacha/client/proof'
import { Signer } from '@storacha/client/principal/ed25519'
import { toast } from 'sonner'

// PAGS Music Space DID
const SPACE_DID = 'did:key:z6Mkncfp4JyM52QFwbeaqSpBFzJ38YgB7a9iwryrp37JiTTz'

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

interface UploadResult {
  cid: string
  url: string
}

let storachaClient: Client.Client | null = null

/**
 * Initialize Storacha client with delegated permissions
 */
export async function initializeStoracha(): Promise<Client.Client> {
  if (storachaClient) {
    return storachaClient
  }

  try {
    // Check if we have stored delegation
    const storedKey = localStorage.getItem('storacha_agent_key')
    const storedProof = localStorage.getItem('storacha_delegation_proof')

    if (storedKey && storedProof) {
      // Use existing delegation
      const principal = Signer.parse(storedKey)
      const store = new StoreMemory()
      const client = await Client.create({ principal, store })
      
      const proof = await Proof.parse(storedProof)
      const space = await client.addSpace(proof)
      await client.setCurrentSpace(space.did())
      
      storachaClient = client
      return client
    } else {
      // Use hardcoded credentials for PAGS music project
      const PAGS_PRIVATE_KEY = 'MgCZ+Uts4m6X+xFBfcR8tJJIYla98z9uj5M33VbKGc1BTU+0BsxwgsejAp/h4gRBfGb4/Sf+47YLzbXHsFeDk+JtA100='
      const PAGS_DELEGATION_PROOF = 'mAYIEAKEWOqJlcm9vdHOB2CpYJQABcRIgrud+NTbvcluLZ/DRYC/y9Cxmu0zXdYQXd+DzQ60/RMdndmVyc2lvbgHoBgFxEiCttGCmYBSLiCm2qib2vSDKBufxDV2JMKSAMD0VFwUGlqhhc1hE7aEDQNoK9Us5vJYHxmY1Y11C3NvagSLKKUT3oCUqDGJsxS9HVpLgSuqsHVF41+QL+Ra3L0NdF7IBF04N0cTJvw2cIQBhdmUwLjkuMWNhdHSIomNjYW5nc3BhY2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U6JjY2FuZmJsb2IvKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U6JjY2FuZ2luZGV4Lypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVOiY2NhbmdzdG9yZS8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTomNjYW5odXBsb2FkLypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVOiY2NhbmhhY2Nlc3MvKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U6JjY2FuamZpbGVjb2luLypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVOiY2Nhbmd1c2FnZS8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTY2F1ZFgi7QHLtZJ0FMjiguPFOWSoM7tzdzWJBgviD43CIDKtN6MisGNleHAaaqHgxmNmY3SBoWVzcGFjZaJkbmFtZWVtdXNpY2ZhY2Nlc3OhZHR5cGVmcHVibGljY2lzc1gi7QEv+/SB7zx/qbv90CB5/1Mmq/Rx9jLLm1SR98czrmLAIWNwcmaA6AYBcRIg3X8cptvZt6MaK9kpLJO8X6jmIWs+/KkAZfqG5m5vr/GoYXNYRO2hA0AE1gjAZiNZDwt6peNHVasIkwB/877dazQTamPCscK6vvxwxYewsGdvWlDNknKEsJBSWF2UaAwof2sqQsSbMnQGYXZlMC45LjFjYXR0iKJjY2FuZ3NwYWNlLypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVOiY2NhbmZibG9iLypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVOiY2NhbmdpbmRleC8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTomNjYW5nc3RvcmUvKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U6JjY2FuaHVwbG9hZC8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTomNjYW5oYWNjZXNzLypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVOiY2NhbmpmaWxlY29pbi8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTomNjYW5ndXNhZ2UvKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U2NhdWRYIu0By7WSdBTI4oLjxTlkqDO7c3c1iQYL4g+NwiAyrTejIrBjZXhwGmqh4ehjZmN0gaFlc3BhY2WiZG5hbWVlbXVzaWNmYWNjZXNzoWR0eXBlZnB1YmxpY2Npc3NYIu0BL/v0ge88f6m7/dAgef9TJqv0cfYyy5tUkffHM65iwCFjcHJmgLYHAXESINxuVbqQRUdK3PXyGCIARrKrtlVIWNZh9gImgMbL4KEVqGFzWETtoQNALF2/S/Awyxh/RskwwmEI3FQy+6nTMMY6YtAusXz98sYlcBbkKCKWQi4nEZlm0Lejyskd+YNWEazOIZ79AnkJAmF2ZTAuOS4xY2F0dIiiY2NhbmdzcGFjZS8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTomNjYW5mYmxvYi8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTomNjYW5naW5kZXgvKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U6JjY2FuZ3N0b3JlLypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVOiY2Nhbmh1cGxvYWQvKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U6JjY2FuaGFjY2Vzcy8qZHdpdGh4OGRpZDprZXk6ejZNa2hnYTM4dU5jVkZpQ1BoV25yOXpGY2NrU1Zta1VYaGI1VHY3Z1VXQ0tvMzlTomNjYW5qZmlsZWNvaW4vKmR3aXRoeDhkaWQ6a2V5Ono2TWtoZ2EzOHVOY1ZGaUNQaFducjl6RmNja1NWbWtVWGhiNVR2N2dVV0NLbzM5U6JjY2FuZ3VzYWdlLypkd2l0aHg4ZGlkOmtleTp6Nk1raGdhMzh1TmNWRmlDUGhXbnI5ekZjY2tTVm1rVVhoYjVUdjdnVVdDS28zOVNjYXVkWCLtAbMcILHowKf4eIEQXxm+P0n/uO2C821x7BXg5PibQNdNY2V4cPZjZmN0gaFlc3BhY2WiZG5hbWVlbXVzaWNmYWNjZXNzoWR0eXBlZnB1YmxpY2Npc3NYIu0By7WSdBTI4oLjxTlkqDO7c3c1iQYL4g+NwiAyrTejIrBjcHJmgtgqWCUAAXESIK20YKZgFIuIKbaqJva9IMoG5/ENXYkwpIAwPRUXBQaW2CpYJQABcRIg3X8cptvZt6MaK9kpLJO8X6jmIWs+/KkAZfqG5m5vr/FZAXESIK7nfjU273Jbi2fw0WAv8vQsZrtM13WEF3fg80OtP0THoWp1Y2FuQDAuOS4x2CpYJQABcRIg3G5VupBFR0rc9fIYIgBGsqu2VUhY1mH2AiaAxsvgoRU'
      
      console.log('🔧 Using PAGS production Storacha credentials')
      
      // Create client with PAGS credentials
      const principal = Signer.parse(PAGS_PRIVATE_KEY)
      const store = new StoreMemory()
      const client = await Client.create({ principal, store })
      
      // Add the delegation proof to access the space
      const proof = await Proof.parse(PAGS_DELEGATION_PROOF)
      const space = await client.addSpace(proof)
      await client.setCurrentSpace(space.did())
      
      console.log('✅ PAGS Storacha client initialized successfully')
      console.log('📁 Space DID:', space.did())
      
      storachaClient = client
      return client
    }
  } catch (error) {
    console.error('Failed to initialize Storacha client:', error)
    throw new Error('Failed to initialize IPFS storage client')
  }
}

/**
 * Upload a single file to IPFS via Storacha
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  let progressInterval: NodeJS.Timeout | undefined
  
  try {
    const client = await initializeStoracha()
    
    // Simulate progress for now (Storacha doesn't provide upload progress callbacks yet)
    const totalSize = file.size
    progressInterval = setInterval(() => {
      const fakeProgress = Math.min(90, Math.random() * 100)
      onProgress?.({
        loaded: (fakeProgress / 100) * totalSize,
        total: totalSize,
        percentage: fakeProgress
      })
    }, 500)

    console.log(`📁 Uploading file to IPFS: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    
    // Upload file to Storacha
    const cid = await client.uploadFile(file)
    
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = undefined
    }
    
    // Final progress update
    onProgress?.({
      loaded: totalSize,
      total: totalSize,
      percentage: 100
    })

    const result = {
      cid: cid.toString(),
      url: `https://${cid}.ipfs.w3s.link`
    }

    console.log(`✅ File uploaded successfully:`, result)
    toast.success(`File uploaded to IPFS`, {
      description: `CID: ${result.cid.slice(0, 12)}...`
    })

    return result

  } catch (error) {
    console.error('Failed to upload file to IPFS:', error)
    if (progressInterval) {
      clearInterval(progressInterval)
    }
    
    // Provide detailed error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('no delegation')) {
      toast.error('IPFS Upload Setup Required', { 
        description: 'Please set up Storacha delegation for uploads to work. Check console for details.' 
      })
      console.error(`
🔧 STORACHA SETUP REQUIRED:

To enable IPFS uploads, you need to set up Storacha delegation:

1. Install Storacha CLI: npm install -g @storacha/cli
2. Login: storacha login your-email@example.com  
3. Create a space: storacha space create pags-music-space
4. Set up backend delegation (see storacha-backend.example.ts)

For now, uploads will fail without proper delegation.
      `)
    } else {
      toast.error('Failed to upload to IPFS', { 
        description: `Error: ${errorMessage}` 
      })
    }
    
    throw new Error(`IPFS upload failed: ${errorMessage}`)
  }
}

/**
 * Upload multiple files as a directory to IPFS
 */
export async function uploadDirectory(
  files: File[],
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    const client = await initializeStoracha()
    
    const totalSize = files.reduce((acc, file) => acc + file.size, 0)
    const progressInterval = setInterval(() => {
      const fakeProgress = Math.min(90, Math.random() * 100)
      onProgress?.({
        loaded: (fakeProgress / 100) * totalSize,
        total: totalSize,
        percentage: fakeProgress
      })
    }, 500)

    console.log(`📁 Uploading ${files.length} files to IPFS directory (${(totalSize / 1024 / 1024).toFixed(2)} MB total)`)
    
    // Upload directory to Storacha
    const cid = await client.uploadDirectory(files)
    
    clearInterval(progressInterval)
    
    // Final progress update
    onProgress?.({
      loaded: totalSize,
      total: totalSize,
      percentage: 100
    })

    const result = {
      cid: cid.toString(),
      url: `https://${cid}.ipfs.w3s.link`
    }

    console.log(`✅ Directory uploaded successfully:`, result)
    toast.success(`Directory uploaded to IPFS`, {
      description: `${files.length} files • CID: ${result.cid.slice(0, 12)}...`
    })

    return result

  } catch (error) {
    console.error('Failed to upload directory to IPFS:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    toast.error('Failed to upload to IPFS', { 
      description: `Error: ${errorMessage}` 
    })
    
    throw new Error(`IPFS upload failed: ${errorMessage}`)
  }
}

/**
 * Create delegation from backend (for production use)
 * This would be called from your backend API
 */
export async function requestDelegation(userAgentDID: string): Promise<Uint8Array> {
  try {
    // This should be implemented in your backend
    const response = await fetch('/api/storacha-delegation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ did: userAgentDID }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get delegation: ${response.statusText}`)
    }

    const delegationBytes = await response.arrayBuffer()
    return new Uint8Array(delegationBytes)

  } catch (error) {
    console.error('Failed to request delegation:', error)
    throw error
  }
}

/**
 * Store delegation credentials for reuse
 */
export function storeDelegationCredentials(agentKey: string, delegationProof: string) {
  localStorage.setItem('storacha_agent_key', agentKey)
  localStorage.setItem('storacha_delegation_proof', delegationProof)
}

/**
 * Clear stored delegation credentials
 */
export function clearDelegationCredentials() {
  localStorage.removeItem('storacha_agent_key')
  localStorage.removeItem('storacha_delegation_proof')
}

/**
 * Get file from IPFS via CID
 */
export function getIPFSUrl(cid: string, filename?: string): string {
  const baseUrl = `https://${cid}.ipfs.w3s.link`
  return filename ? `${baseUrl}/${filename}` : baseUrl
}

/**
 * Check if Storacha is properly configured
 */
export async function checkStorachaStatus(): Promise<{
  configured: boolean
  hasCredentials: boolean
  spaceConnected: boolean
  error?: string
}> {
  try {
    const hasCredentials = !!(
      localStorage.getItem('storacha_agent_key') && 
      localStorage.getItem('storacha_delegation_proof')
    )

    if (!hasCredentials) {
      return {
        configured: false,
        hasCredentials: false,
        spaceConnected: false,
        error: 'No delegation credentials found'
      }
    }

    // Try to initialize client
    const client = await initializeStoracha()
    const spaces = client.spaces()
    const spaceConnected = spaces.length > 0

    return {
      configured: true,
      hasCredentials,
      spaceConnected,
    }

  } catch (error) {
    return {
      configured: false,
      hasCredentials: false,
      spaceConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Upload helper specifically for music files
export const uploadAudioFile = (file: File, onProgress?: (progress: UploadProgress) => void) => 
  uploadFile(file, onProgress)

export const uploadCoverArt = (file: File, onProgress?: (progress: UploadProgress) => void) => 
  uploadFile(file, onProgress)

export const uploadLyrics = (file: File, onProgress?: (progress: UploadProgress) => void) => 
  uploadFile(file, onProgress)

// Alias for backward compatibility
export const uploadToIPFS: typeof uploadFile = uploadFile