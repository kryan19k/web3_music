/// <reference types="vitest" />
import { resolve } from 'node:path'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  // Explicitly define environment variables
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://jeidwpgexretlgjgzsps.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaWR3cGdleHJldGxnamd6c3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDE4MzYsImV4cCI6MjA3MzAxNzgzNn0.797GY5p4nUbzQoMIRa9AbyyZcf7d_X1zq97oMaKuVKY'),
    'import.meta.env.VITE_STORACHA_SPACE_DID': JSON.stringify('did:key:z6Mkncfp4JyM52QFwbeaqSpBFzJ38YgB7a9iwryrp37JiTTz'),
    'import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID': JSON.stringify('e16d1b7efaf6b44d794a70535ac8fb39'),
    'import.meta.env.VITE_APP_URL': JSON.stringify('http://localhost:5173'),
  },
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tsconfigPaths(),
  ],
  envPrefix: 'PUBLIC_',
  resolve: {
    alias: {
      '@/src': resolve(__dirname, './src'),
      '@packageJSON': resolve(__dirname, 'package.json'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setupTests.ts'],
  },
})
