/**
 * Supabase Client Configuration
 * Database client for PAGS Music Platform
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/src/types/supabase'

import { env } from '@/src/env'

const supabaseUrl = env.SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Storage buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  COVER_ART: 'cover-art',
  AUDIO_FILES: 'audio-files',
  ASSETS: 'assets'
} as const

// Helper functions
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const uploadFile = async (
  bucket: string, 
  path: string, 
  file: File,
  options: {
    upsert?: boolean
    contentType?: string
  } = {}
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: options.upsert ?? false,
      contentType: options.contentType ?? file.type
    })

  if (error) throw error
  return data
}

export const deleteFile = async (bucket: string, paths: string[]) => {
  const { data, error } = await supabase.storage.from(bucket).remove(paths)
  if (error) throw error
  return data
}

// Auth helpers
export const signInWithWallet = async (address: string, signature: string) => {
  // Custom wallet-based authentication
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${address}@web3.pags`, // Use wallet address as unique identifier
    password: signature, // Use signature as password
  })

  return { data, error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
