/**
 * IPFS Gateway Utilities
 * Provides reliable IPFS URL generation with fallback gateways
 */

// IPFS Gateways optimized for Storacha/w3s usage
export const IPFS_GATEWAYS = {
  // Primary gateway - Storacha (subdomain style - preferred for security isolation)
  W3S: (cid: string) => `https://${cid}.ipfs.w3s.link`,
  
  // Storacha alternative - path style (backup for same service)
  STORACHA: (cid: string) => `https://storacha.link/ipfs/${cid}`,
  
  // Other reliable gateways with subdomain support
  DWEB: (cid: string) => `https://${cid}.ipfs.dweb.link`,
  NFTSTORAGE: (cid: string) => `https://${cid}.ipfs.nftstorage.link`,
  
  // Path-style fallbacks (broader compatibility but less secure)
  CLOUDFLARE: (cid: string) => `https://cloudflare-ipfs.com/ipfs/${cid}`,
  PINATA: (cid: string) => `https://gateway.pinata.cloud/ipfs/${cid}`,
  FLEEK: (cid: string) => `https://ipfs.fleek.co/ipfs/${cid}`,
  
  // Fallback gateway (often slow but widely compatible)
  GENERIC: (cid: string) => `https://ipfs.io/ipfs/${cid}`,
} as const

/**
 * Get the best IPFS URL for a given hash/CID
 * Prefers faster, more reliable gateways
 */
export function getIPFSUrl(hash: any, preferredGateway: 'w3s' | 'dweb' | 'pinata' | 'nftstorage' | 'generic' = 'w3s'): string {
  // Handle empty/null/undefined
  if (!hash) return ''
  
  // Convert to string (handles objects, numbers, etc.)
  let hashString = String(hash).trim()
  
  // Handle [object Object] case
  if (hashString === '[object Object]') {
    console.warn('🚫 [IPFS] Received object instead of hash:', hash)
    return ''
  }
  
  // If already a full URL, return as-is
  if (hashString.startsWith('http')) return hashString
  
  // Remove 'ipfs://' prefix if present
  hashString = hashString.replace('ipfs://', '')
  
  // Validate CID format (basic check)
  if (!hashString || hashString.length < 10 || hashString.includes(' ')) {
    console.warn('🚫 [IPFS] Invalid hash format:', hashString)
    return ''
  }
  
  // For localhost development, keep w3s as preferred since it's working for this project
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  // Commenting out the dweb override since w3s.link is working better
  // if (isLocalhost && preferredGateway === 'w3s') {
  //   preferredGateway = 'dweb'
  // }
  
  switch (preferredGateway) {
    case 'w3s':
      return IPFS_GATEWAYS.W3S(hashString)
    case 'storacha':
      return IPFS_GATEWAYS.STORACHA(hashString)
    case 'dweb':
      return IPFS_GATEWAYS.DWEB(hashString)
    case 'nftstorage':
      return IPFS_GATEWAYS.NFTSTORAGE(hashString)
    case 'cloudflare':
      return IPFS_GATEWAYS.CLOUDFLARE(hashString)
    case 'pinata':
      return IPFS_GATEWAYS.PINATA(hashString)
    case 'fleek':
      return IPFS_GATEWAYS.FLEEK(hashString)
    case 'generic':
    default:
      return IPFS_GATEWAYS.GENERIC(hashString)
  }
}

/**
 * Get multiple gateway URLs for the same content
 * Useful for providing fallbacks in media elements
 */
export function getIPFSUrls(hash: any): string[] {
  if (!hash) return []
  
  // Convert to string and validate
  let hashString = String(hash).trim()
  if (hashString === '[object Object]' || hashString.length < 10) return []
  
  if (hashString.startsWith('http')) return [hashString]
  
  const cid = hashString.replace('ipfs://', '')
  
  // For localhost, prioritize DWEB and exclude rate-limited gateways
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  
  if (isLocalhost) {
    return [
      IPFS_GATEWAYS.DWEB(cid),       // Best for localhost - no CORS issues
      IPFS_GATEWAYS.W3S(cid),        // Backup 1
      IPFS_GATEWAYS.GENERIC(cid),    // Backup 2
      // Skip Pinata and NFTStorage to avoid rate limiting
    ]
  }
  
  return [
    IPFS_GATEWAYS.W3S(cid),        // Primary Storacha (subdomain style)
    IPFS_GATEWAYS.STORACHA(cid),   // Storacha fallback (path style)
    IPFS_GATEWAYS.DWEB(cid),       // Reliable subdomain gateway
    IPFS_GATEWAYS.NFTSTORAGE(cid), // Another subdomain gateway
    IPFS_GATEWAYS.CLOUDFLARE(cid), // Fast CDN (path style)
    IPFS_GATEWAYS.PINATA(cid),     // Reliable (path style)
    IPFS_GATEWAYS.FLEEK(cid),      // Alternative (path style)
    IPFS_GATEWAYS.GENERIC(cid),    // Last resort
  ]
}

/**
 * Test if an IPFS URL is accessible
 */
export async function testIPFSUrl(url: string, timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get the first working IPFS URL from multiple gateways
 */
export async function getWorkingIPFSUrl(hash: any): Promise<string | null> {
  const urls = getIPFSUrls(hash)
  
  if (urls.length === 0) {
    console.warn('🚫 [IPFS] No valid URLs to test for hash:', hash)
    return null
  }
  
  // Test URLs in parallel and return the first one that works
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const works = await testIPFSUrl(url)
      if (works) return url
      throw new Error('Gateway not working')
    })
  )
  
  // Return the first successful URL
  for (const result of results) {
    if (result.status === 'fulfilled') {
      return result.value
    }
  }
  
  return null
}

/**
 * Debug IPFS URLs by testing all gateways
 */
export async function debugIPFSAccess(hash: any): Promise<{
  hash: string
  urls: Array<{ gateway: string; url: string; working: boolean }>
  workingUrls: string[]
}> {
  // Convert to string and validate
  const hashString = String(hash || '').trim()
  
  if (!hashString || hashString === '[object Object]' || hashString.length < 10) {
    console.warn('🚫 [IPFS_DEBUG] Invalid hash for testing:', hashString, 'Original:', hash)
    return { hash: hashString, urls: [], workingUrls: [] }
  }
  
  const cid = hashString.replace('ipfs://', '')
  
  // For localhost development, limit testing to avoid rate limits
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const gateways = isLocalhost ? [
    { name: 'DWEB', url: IPFS_GATEWAYS.DWEB(cid) },
    { name: 'W3S', url: IPFS_GATEWAYS.W3S(cid) },
    { name: 'GENERIC', url: IPFS_GATEWAYS.GENERIC(cid) },
  ] : [
    { name: 'W3S', url: IPFS_GATEWAYS.W3S(cid) },
    { name: 'DWEB', url: IPFS_GATEWAYS.DWEB(cid) },
    { name: 'PINATA', url: IPFS_GATEWAYS.PINATA(cid) },
    { name: 'NFTSTORAGE', url: IPFS_GATEWAYS.NFTSTORAGE(cid) },
    { name: 'GENERIC', url: IPFS_GATEWAYS.GENERIC(cid) },
  ]
  
  console.log(`🔍 [IPFS_DEBUG] Testing ${gateways.length} gateways for hash: ${hashString}`)
  
  const results = await Promise.allSettled(
    gateways.map(async ({ name, url }) => {
      const working = await testIPFSUrl(url, isLocalhost ? 5000 : 3000)
      console.log(`${working ? '✅' : '❌'} [IPFS_DEBUG] ${name}: ${working ? 'Working' : 'Failed'} - ${url}`)
      return { gateway: name, url, working }
    })
  )
  
  const urls = results.map((result, index) => 
    result.status === 'fulfilled' 
      ? result.value 
      : { gateway: gateways[index].name, url: gateways[index].url, working: false }
  )
  
  const workingUrls = urls.filter(u => u.working).map(u => u.url)
  
  console.log(`📊 [IPFS_DEBUG] Summary for ${hashString}:`, {
    totalGateways: urls.length,
    workingGateways: workingUrls.length,
    workingUrls: workingUrls.length > 0 ? workingUrls : 'None working'
  })
  
  return { hash: hashString, urls, workingUrls }
}
