import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { MobileMenu, MobileMenuTrigger } from '@/src/components/ui/mobile-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/src/components/ui/navigation-menu'
import { ConnectWalletButton } from '@/src/components/web3/ConnectWalletButton'
import { NetworkSwitcher } from '@/src/components/web3/NetworkSwitcher'
import { ThemeToggle } from '@/src/components/ui/ThemeToggle'
import { useTheme } from '@/src/contexts/ThemeContext'
import { cn } from '@/src/lib/utils'
import { Link } from '@tanstack/react-router'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import {
  BarChart3,
  Coins,
  Disc3,
  Home,
  Menu,
  Moon,
  Music,
  Search,
  Shield,
  ShoppingBag,
  Sun,
  TrendingUp,
  Upload,
} from 'lucide-react'
import * as React from 'react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { setTheme, actualTheme } = useTheme()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
  })

  return (
    <motion.header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg'
          : 'bg-transparent',
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-0 group-hover:gap-3"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="flex items-center gap-00">
              {/* Round Logo */}
              <div className="relative">
                <img
                  src="/logogray.png"
                  alt="Pags Music Logo"
                  width={80}
                  height={80}
                  className="dark:hidden dim:hidden"
                />
                <img
                  src="/logowhite.png"
                  alt="Pags Music Logo"
                  width={80}
                  height={80}
                  className="hidden dark:block dim:block"
                />
                
              </div>
              
              {/* Text Logo */}
              <div>
                <img
                  src="/textdark.png"
                  alt="Pags Music"
                  width={150}
                  height={80}
                  className="dark:hidden dim:hidden"
                />
                <img
                  src="/logotext.png"
                  alt="Pags Music"
                  width={150}
                  height={80}
                  className="hidden dark:block dim:block"
                />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Disc3 className="w-4 h-4 mr-2" />
                Marketplace
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500/20 to-pink-500/20 p-6 no-underline outline-none focus:shadow-md"
                        to="/marketplace"
                      >
                        <Music className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">Music NFTs</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Discover and own exclusive music NFTs from your favorite artists
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid gap-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/marketplace"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <div className="text-sm font-medium leading-none">Trending</div>
                        </div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Hot tracks and viral hits
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/marketplace"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-yellow-500 text-white"
                          >
                            NEW
                          </Badge>
                          <div className="text-sm font-medium leading-none">Fresh Drops</div>
                        </div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Latest releases and debuts
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/playlists"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Music className="w-4 h-4 mr-2" />
                  Playlists
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Coins className="w-4 h-4 mr-2" />
                PAGS Token
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[300px]">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/pags"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-green-500" />
                        <div className="text-sm font-medium leading-none">Dashboard</div>
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        View your PAGS balance and earnings
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/pags"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Swap Tokens</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Exchange PAGS for other tokens
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/pags"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Stake & Earn</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Lock PAGS tokens to earn rewards
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/portfolio"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Portfolio
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Network Switcher */}
          <div className="hidden md:block">
            <NetworkSwitcher variant="compact" />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle variant="dropdown" className="hidden md:flex" />

          {/* Admin Panel Link */}
          <Link
            to="/admin"
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <Shield className="w-4 h-4" />
            Admin
          </Link>

          {/* Connect Wallet */}
          <div className="hidden md:block">
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu */}
          <MobileMenuTrigger onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </MobileMenuTrigger>

          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <nav className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg gradient-text">Pags Music</span>
              </div>

              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground px-3">Marketplace</h4>
                <Link
                  to="/marketplace"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors ml-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Disc3 className="w-4 h-4" />
                  Browse Music
                </Link>
                <Link
                  to="/marketplace"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors ml-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </Link>
              </div>

              <Link
                to="/playlists"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Music className="w-4 h-4" />
                Playlists
              </Link>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground px-3">PAGS Token</h4>
                <Link
                  to="/pags"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors ml-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Coins className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/pags"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors ml-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Swap
                </Link>
              </div>

              <Link
                to="/portfolio"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                Portfolio
              </Link>

              <div className="border-t my-2" />

              <Link
                to="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/20 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>

              <Link
                to="/artist/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Upload className="w-4 h-4" />
                Artist Dashboard
              </Link>

              <div className="flex items-center justify-between px-3 py-2 mt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <span className="text-xs text-muted-foreground">
                    Choose your preferred theme
                  </span>
                </div>
                <ThemeToggle variant="dropdown" showTooltip={false} />
              </div>

              {/* Mobile Network Switcher */}
              <div className="px-3 py-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <NetworkSwitcher variant="default" />
                </div>
              </div>

              {/* Mobile Connect Wallet */}
              <div className="px-3 py-2">
                <ConnectWalletButton />
              </div>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </motion.header>
  )
}
