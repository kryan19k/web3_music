/**
 * Environment Configuration
 * Type-safe environment variables with validation
 */

interface EnvironmentConfig {
  // Supabase
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  
  // IPFS/Storacha
  STORACHA_SPACE_DID?: string
  
  // Web3
  WALLET_CONNECT_PROJECT_ID?: string
  PUBLIC_WALLETCONNECT_PROJECT_ID?: string
  PUBLIC_INCLUDE_TESTNETS?: boolean
  
  // RPC Endpoints - Mainnets
  PUBLIC_RPC_MAINNET?: string
  PUBLIC_RPC_ARBITRUM?: string
  PUBLIC_RPC_OPTIMISM?: string
  PUBLIC_RPC_POLYGON?: string
  PUBLIC_RPC_BASE?: string
  PUBLIC_RPC_BSC?: string
  PUBLIC_RPC_AVALANCHE?: string
  PUBLIC_RPC_FANTOM?: string
  
  // RPC Endpoints - Testnets
  PUBLIC_RPC_SEPOLIA?: string
  PUBLIC_RPC_POLYGON_AMOY?: string
  PUBLIC_RPC_OPTIMISM_SEPOLIA?: string
  PUBLIC_RPC_ARBITRUM_SEPOLIA?: string
  PUBLIC_RPC_BASE_SEPOLIA?: string
  PUBLIC_RPC_BSC_TESTNET?: string
  PUBLIC_RPC_AVALANCHE_FUJI?: string
  PUBLIC_RPC_FANTOM_TESTNET?: string
  
  // App
  APP_URL: string
  PUBLIC_APP_URL?: string
  PUBLIC_APP_NAME?: string
  PUBLIC_APP_DESCRIPTION?: string
  PUBLIC_APP_LOGO?: string
  NODE_ENV: 'development' | 'production' | 'test'
}

function getEnvVar(key: string, defaultValue?: string): string | undefined {
  const viteKey = `VITE_${key}`
  const value = import.meta.env[viteKey]
  
  if (!value && !defaultValue) {
    // Only throw for required variables (ones without defaults)
    if (defaultValue === undefined) {
      return undefined
    }
    console.error(`❌ Missing environment variable: ${viteKey}`)
    throw new Error(`Missing required environment variable: ${viteKey}`)
  }
  
  return value || defaultValue!
}

function getRequiredEnvVar(key: string, defaultValue?: string): string {
  const result = getEnvVar(key, defaultValue)
  if (result === undefined) {
    console.error(`❌ Missing required environment variable: VITE_${key}`)
    throw new Error(`Missing required environment variable: VITE_${key}`)
  }
  return result
}

export const env: EnvironmentConfig = {
  // Supabase - provide fallbacks for now
  SUPABASE_URL: getRequiredEnvVar('SUPABASE_URL', 'https://jeidwpgexretlgjgzsps.supabase.co'),
  SUPABASE_ANON_KEY: getRequiredEnvVar('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWR3cGdleHJldGxnamd6c3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDE4MzYsImV4cCI6MjA3MzAxNzgzNn0.797GY5p4nUbzQoMIRa9AbyyZcf7d_X1zq97oMaKuVKY'),
  
  // IPFS/Storacha
  STORACHA_SPACE_DID: getEnvVar('STORACHA_SPACE_DID', 'did:key:z6Mkncfp4JyM52QFwbeaqSpBFzJ38YgB7a9iwryrp37JiTTz'),
  
  // Web3
  WALLET_CONNECT_PROJECT_ID: getEnvVar('WALLET_CONNECT_PROJECT_ID', 'e16d1b7efaf6b44d794a70535ac8fb39'),
  PUBLIC_WALLETCONNECT_PROJECT_ID: getEnvVar('PUBLIC_WALLETCONNECT_PROJECT_ID', 'e16d1b7efaf6b44d794a70535ac8fb39'),
  PUBLIC_INCLUDE_TESTNETS: import.meta.env.VITE_PUBLIC_INCLUDE_TESTNETS !== 'false', // Default to true for development
  
  // RPC Endpoints - Mainnets
  PUBLIC_RPC_MAINNET: getEnvVar('PUBLIC_RPC_MAINNET'),
  PUBLIC_RPC_ARBITRUM: getEnvVar('PUBLIC_RPC_ARBITRUM'),
  PUBLIC_RPC_OPTIMISM: getEnvVar('PUBLIC_RPC_OPTIMISM'),
  PUBLIC_RPC_POLYGON: getEnvVar('PUBLIC_RPC_POLYGON'),
  PUBLIC_RPC_BASE: getEnvVar('PUBLIC_RPC_BASE'),
  PUBLIC_RPC_BSC: getEnvVar('PUBLIC_RPC_BSC'),
  PUBLIC_RPC_AVALANCHE: getEnvVar('PUBLIC_RPC_AVALANCHE'),
  PUBLIC_RPC_FANTOM: getEnvVar('PUBLIC_RPC_FANTOM'),
  
  // RPC Endpoints - Testnets
  PUBLIC_RPC_SEPOLIA: getEnvVar('PUBLIC_RPC_SEPOLIA'),
  PUBLIC_RPC_POLYGON_AMOY: getEnvVar('PUBLIC_RPC_POLYGON_AMOY', 'https://rpc-amoy.polygon.technology/'),
  PUBLIC_RPC_OPTIMISM_SEPOLIA: getEnvVar('PUBLIC_RPC_OPTIMISM_SEPOLIA'),
  PUBLIC_RPC_ARBITRUM_SEPOLIA: getEnvVar('PUBLIC_RPC_ARBITRUM_SEPOLIA'),
  PUBLIC_RPC_BASE_SEPOLIA: getEnvVar('PUBLIC_RPC_BASE_SEPOLIA'),
  PUBLIC_RPC_BSC_TESTNET: getEnvVar('PUBLIC_RPC_BSC_TESTNET'),
  PUBLIC_RPC_AVALANCHE_FUJI: getEnvVar('PUBLIC_RPC_AVALANCHE_FUJI'),
  PUBLIC_RPC_FANTOM_TESTNET: getEnvVar('PUBLIC_RPC_FANTOM_TESTNET'),
  
  // App
  APP_URL: getRequiredEnvVar('APP_URL', 'http://localhost:5173'),
  PUBLIC_APP_URL: getEnvVar('PUBLIC_APP_URL', 'http://localhost:5173'),
  PUBLIC_APP_NAME: getEnvVar('PUBLIC_APP_NAME', 'PAGS Music Marketplace'),
  PUBLIC_APP_DESCRIPTION: getEnvVar('PUBLIC_APP_DESCRIPTION', 'Decentralized music marketplace built with Web3'),
  PUBLIC_APP_LOGO: getEnvVar('PUBLIC_APP_LOGO', '/logo.png'),
  NODE_ENV: (import.meta.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
}

// Validation
if (env.NODE_ENV === 'production') {
  if (!env.STORACHA_SPACE_DID) {
    console.warn('⚠️  STORACHA_SPACE_DID is not set - using default PAGS space')
  }
  
  if (!env.WALLET_CONNECT_PROJECT_ID) {
    console.warn('⚠️  WALLET_CONNECT_PROJECT_ID is not set - some wallet features may not work')
  }
}

console.log('🔧 Environment loaded:', {
  NODE_ENV: env.NODE_ENV,
  SUPABASE_URL: env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
  SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  STORACHA_SPACE_DID: env.STORACHA_SPACE_DID ? '✅ Set' : '⚠️  Not set',
  WALLET_CONNECT_PROJECT_ID: env.WALLET_CONNECT_PROJECT_ID ? '✅ Set' : '⚠️  Not set',
  PUBLIC_WALLETCONNECT_PROJECT_ID: env.PUBLIC_WALLETCONNECT_PROJECT_ID ? '✅ Set' : '⚠️  Not set',
  PUBLIC_INCLUDE_TESTNETS: env.PUBLIC_INCLUDE_TESTNETS ? '✅ Enabled (testnets included)' : '⚠️ Disabled (mainnet only)',
  PUBLIC_APP_NAME: env.PUBLIC_APP_NAME ? '✅ Set' : '⚠️ Not set',
})