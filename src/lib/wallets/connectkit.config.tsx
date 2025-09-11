import Avatar from '@/src/components/sharedComponents/Avatar'
import { env } from '@/src/env'
import { chains, transports } from '@/src/lib/networks.config'
import { ConnectKitProvider, type Types, getDefaultConfig } from 'connectkit'
import type { FC, ReactNode } from 'react'
import type { Address } from 'viem'
import { normalize } from 'viem/ens'
import { createConfig, useEnsAvatar, useEnsName } from 'wagmi'

interface Props {
  address: Address
  size: number
}

const UserAvatar: FC<Props> = ({ address, size }: Props) => {
  const { data: ensName } = useEnsName({ address })

  const { data: avatarImg } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
  })

  return (
    <Avatar
      address={address}
      ensImage={avatarImg}
      ensName={ensName}
      size={size}
    />
  )
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConnectKitProvider
      options={{
        customAvatar: Avatar as FC<Types.CustomAvatarProps>,
        initialChainId: 0,
        enforceSupportedChains: false,
      }}
    >
      {children}
    </ConnectKitProvider>
  )
}

const defaultConfig = {
  chains,
  transports,

  // Required API Keys
  walletConnectProjectId: env.PUBLIC_WALLETCONNECT_PROJECT_ID,

  // Required App Info
  appName: env.PUBLIC_APP_NAME,

  // Optional App Info
  appDescription: env.PUBLIC_APP_DESCRIPTION,
  appUrl: env.PUBLIC_APP_URL,
  appIcon: env.PUBLIC_APP_LOGO,
} as const

// Debug logging for wagmi configuration
console.log('🔧 Wagmi Configuration Debug:', {
  chainsCount: chains.length,
  hasPolygonAmoy: chains.some(chain => chain.id === 80002),
  polygonAmoyTransport: transports[80002] ? '✅ Configured' : '❌ Missing',
  walletConnectProjectId: env.PUBLIC_WALLETCONNECT_PROJECT_ID ? '✅ Set' : '❌ Missing',
  appName: env.PUBLIC_APP_NAME,
  supportedChainIds: chains.map(chain => ({ id: chain.id, name: chain.name }))
})

const connectkitConfig = getDefaultConfig(defaultConfig)

export const config = createConfig(connectkitConfig)
