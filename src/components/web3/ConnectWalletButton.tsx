import { Button } from '@/src/components/ui/button'
import { ConnectKitButton } from 'connectkit'
import * as React from 'react'

interface ConnectWalletButtonProps {
  label?: string
  className?: string
}

export function ConnectWalletButton({
  label = 'Connect Wallet',
  className = '',
}: ConnectWalletButtonProps = {}) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, truncatedAddress, ensName }) => {
        return (
          <Button
            onClick={show}
            disabled={isConnecting}
            className={`${
              isConnected
                ? 'bg-background border border-border hover:bg-accent text-foreground'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            } ${className}`}
          >
            {isConnecting && 'Connecting...'}
            {isConnected && (ensName ?? truncatedAddress)}
            {!isConnected && !isConnecting && label}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
