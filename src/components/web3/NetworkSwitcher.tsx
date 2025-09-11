/**
 * Network Switcher Component
 * Allows users to switch between different blockchain networks
 */

import { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { ChevronDown, Globe, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import { Badge } from '@/src/components/ui/badge'
import { toast } from 'sonner'
import { chains } from '@/src/lib/networks.config'
import { cn } from '@/src/lib/utils'

interface NetworkInfo {
  id: number
  name: string
  isTestnet: boolean
  color: string
  icon?: string
}

// Network display configuration
const networkConfig: Record<number, NetworkInfo> = {
  // Mainnets
  1: { id: 1, name: 'Ethereum', isTestnet: false, color: 'bg-blue-500' },
  137: { id: 137, name: 'Polygon', isTestnet: false, color: 'bg-purple-500' },
  42161: { id: 42161, name: 'Arbitrum', isTestnet: false, color: 'bg-blue-600' },
  10: { id: 10, name: 'Optimism', isTestnet: false, color: 'bg-red-500' },
  8453: { id: 8453, name: 'Base', isTestnet: false, color: 'bg-indigo-500' },
  56: { id: 56, name: 'BSC', isTestnet: false, color: 'bg-yellow-500' },
  43114: { id: 43114, name: 'Avalanche', isTestnet: false, color: 'bg-red-600' },
  250: { id: 250, name: 'Fantom', isTestnet: false, color: 'bg-blue-400' },
  
  // Testnets
  11155111: { id: 11155111, name: 'Sepolia', isTestnet: true, color: 'bg-gray-500' },
  80002: { id: 80002, name: 'Polygon Amoy', isTestnet: true, color: 'bg-purple-400' },
  11155420: { id: 11155420, name: 'OP Sepolia', isTestnet: true, color: 'bg-red-400' },
  421614: { id: 421614, name: 'Arbitrum Sepolia', isTestnet: true, color: 'bg-blue-400' },
  84532: { id: 84532, name: 'Base Sepolia', isTestnet: true, color: 'bg-indigo-400' },
  97: { id: 97, name: 'BSC Testnet', isTestnet: true, color: 'bg-yellow-400' },
  43113: { id: 43113, name: 'Avalanche Fuji', isTestnet: true, color: 'bg-red-400' },
  4002: { id: 4002, name: 'Fantom Testnet', isTestnet: true, color: 'bg-blue-300' },
}

interface NetworkSwitcherProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function NetworkSwitcher({ variant = 'default', className }: NetworkSwitcherProps) {
  const { chain, isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const [isOpen, setIsOpen] = useState(false)

  const currentNetwork = chain ? networkConfig[chain.id] : null
  const availableNetworks = chains.map(c => networkConfig[c.id]).filter(Boolean)

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchChain({ chainId })
      toast.success(`Switched to ${networkConfig[chainId]?.name}`)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to switch network:', error)
      toast.error('Failed to switch network. Please try again.')
    }
  }

  const mainnets = availableNetworks.filter(n => !n.isTestnet)
  const testnets = availableNetworks.filter(n => n.isTestnet)

  if (!isConnected) {
    return (
      <Button variant="outline" disabled size={variant === 'compact' ? 'sm' : 'default'}>
        <Globe className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('flex items-center gap-2', className)}
            disabled={isPending}
          >
            {currentNetwork ? (
              <>
                <div className={cn('w-2 h-2 rounded-full', currentNetwork.color)} />
                <span className="hidden sm:inline">{currentNetwork.name}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="hidden sm:inline">Unknown</span>
              </>
            )}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {mainnets.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Mainnets
              </DropdownMenuLabel>
              {mainnets.map((network) => (
                <DropdownMenuItem
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', network.color)} />
                    <span>{network.name}</span>
                  </div>
                  {chain?.id === network.id && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          
          {testnets.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Testnets
              </DropdownMenuLabel>
              {testnets.map((network) => (
                <DropdownMenuItem
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', network.color)} />
                    <span>{network.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Test
                    </Badge>
                  </div>
                  {chain?.id === network.id && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium">Current Network</span>
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={isPending}
          >
            {currentNetwork ? (
              <div className="flex items-center gap-3">
                <div className={cn('w-3 h-3 rounded-full', currentNetwork.color)} />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{currentNetwork.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Chain ID: {chain?.id}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Unknown Network</span>
                  <span className="text-xs text-muted-foreground">
                    Chain ID: {chain?.id}
                  </span>
                </div>
              </div>
            )}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {mainnets.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                Mainnets
              </DropdownMenuLabel>
              {mainnets.map((network) => (
                <DropdownMenuItem
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', network.color)} />
                    <div className="flex flex-col">
                      <span className="font-medium">{network.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Chain ID: {network.id}
                      </span>
                    </div>
                  </div>
                  {chain?.id === network.id && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          
          {testnets.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                Testnets
              </DropdownMenuLabel>
              {testnets.map((network) => (
                <DropdownMenuItem
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', network.color)} />
                    <div className="flex flex-col">
                      <span className="font-medium">{network.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Chain ID: {network.id}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Testnet
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {chain?.id === network.id && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {!currentNetwork && chain?.id && (
        <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded border">
          ⚠️ You're connected to an unsupported network. Please switch to a supported network.
        </div>
      )}
    </div>
  )
}

