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
  
  // App
  APP_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
}

function getEnvVar(key: string, defaultValue?: string): string {
  const viteKey = `VITE_${key}`
  const value = import.meta.env[viteKey]
  
  if (!value && !defaultValue) {
    console.error(`❌ Missing environment variable: ${viteKey}`)
    throw new Error(`Missing required environment variable: ${viteKey}`)
  }
  
  return value || defaultValue!
}

export const env: EnvironmentConfig = {
  // Supabase - provide fallbacks for now
  SUPABASE_URL: getEnvVar('SUPABASE_URL', 'https://jeidwpgexretlgjgzsps.supabase.co'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWR3cGdleHJldGxnamd6c3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDE4MzYsImV4cCI6MjA3MzAxNzgzNn0.797GY5p4nUbzQoMIRa9AbyyZcf7d_X1zq97oMaKuVKY'),
  
  // IPFS/Storacha
  STORACHA_SPACE_DID: getEnvVar('STORACHA_SPACE_DID', 'did:key:z6Mkncfp4JyM52QFwbeaqSpBFzJ38YgB7a9iwryrp37JiTTz'),
  
  // Web3
  WALLET_CONNECT_PROJECT_ID: getEnvVar('WALLET_CONNECT_PROJECT_ID', 'e16d1b7efaf6b44d794a70535ac8fb39'), // Using the one from your screenshot
  
  // App
  APP_URL: getEnvVar('APP_URL', 'http://localhost:5173'),
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
})