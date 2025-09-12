/**
 * Pinata IPFS Upload Service
 * Handles audio file and image uploads to Pinata for better MP3 playback support
 */

interface PinataConfig {
  apiKey: string
  apiSecret: string
  jwt?: string
}

const PINATA_CONFIG: PinataConfig = {
  apiKey: import.meta.env.PINATA_API_KEY || '756a7569af39b6d04bf2',
  apiSecret: import.meta.env.PINATA_API_SECRET || '71561bb62cdd9ccb9b613d7facdefcdd1a56d697a95a0f9ba7d0b15945dceda6',
}

export interface PinataUploadResult {
  IpfsHash: string
  PinSize: number
  Timestamp: string
  isDuplicate?: boolean
}

/**
 * Upload a file to Pinata IPFS
 */
export async function uploadToPinata(
  file: File, 
  options: {
    name?: string
    keyvalues?: Record<string, string | number>
  } = {}
): Promise<PinataUploadResult> {
  console.log('📤 [PINATA] Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

  const formData = new FormData()
  formData.append('file', file)

  // Add metadata
  const metadata = JSON.stringify({
    name: options.name || file.name,
    keyvalues: {
      type: file.type.startsWith('audio/') ? 'audio' : 'image',
      originalName: file.name,
      size: file.size.toString(),
      ...options.keyvalues
    }
  })
  formData.append('pinataMetadata', metadata)

  // Pin options
  const pinOptions = JSON.stringify({
    cidVersion: 1, // Use CIDv1 for better compatibility
  })
  formData.append('pinataOptions', pinOptions)

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_CONFIG.apiKey,
        'pinata_secret_api_key': PINATA_CONFIG.apiSecret,
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [PINATA] Upload failed:', response.status, errorText)
      throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`)
    }

    const result: PinataUploadResult = await response.json()
    console.log('✅ [PINATA] Upload successful:', result.IpfsHash)
    console.log('📊 [PINATA] File size:', result.PinSize, 'bytes')
    
    return result
  } catch (error) {
    console.error('💥 [PINATA] Upload error:', error)
    throw error
  }
}

/**
 * Upload audio file specifically with audio-optimized settings
 */
export async function uploadAudioToPinata(file: File, trackTitle?: string): Promise<string> {
  console.log('🎵 [PINATA] Uploading audio file:', file.name)

  if (!file.type.startsWith('audio/')) {
    throw new Error('File is not an audio file')
  }

  const result = await uploadToPinata(file, {
    name: trackTitle ? `${trackTitle}.${file.name.split('.').pop()}` : file.name,
    keyvalues: {
      contentType: 'audio',
      trackTitle: trackTitle || 'Untitled',
      uploadType: 'music-track'
    }
  })

  // Return the IPFS hash for immediate use
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  console.log('🎵 [PINATA] Audio URL:', ipfsUrl)
  return result.IpfsHash
}

/**
 * Upload image/cover art with image-optimized settings
 */
export async function uploadImageToPinata(file: File, albumTitle?: string): Promise<string> {
  console.log('🖼️ [PINATA] Uploading image file:', file.name)

  if (!file.type.startsWith('image/')) {
    throw new Error('File is not an image file')
  }

  const result = await uploadToPinata(file, {
    name: albumTitle ? `${albumTitle}_cover.${file.name.split('.').pop()}` : file.name,
    keyvalues: {
      contentType: 'image',
      albumTitle: albumTitle || 'Untitled Album',
      uploadType: 'album-cover'
    }
  })

  // Return the IPFS hash for immediate use
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  console.log('🖼️ [PINATA] Image URL:', ipfsUrl)
  return result.IpfsHash
}

/**
 * Get Pinata gateway URL for an IPFS hash
 */
export function getPinataUrl(ipfsHash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
}

/**
 * Test Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': PINATA_CONFIG.apiKey,
        'pinata_secret_api_key': PINATA_CONFIG.apiSecret,
      }
    })

    const result = await response.json()
    console.log('🔍 [PINATA] Connection test:', result)
    return response.ok && result.message === 'Congratulations! You are communicating with the Pinata API!'
  } catch (error) {
    console.error('❌ [PINATA] Connection test failed:', error)
    return false
  }
}