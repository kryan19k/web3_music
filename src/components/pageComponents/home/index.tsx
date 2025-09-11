import { FeaturedNFTs } from '@/src/components/demo/FeaturedNFTs'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { FeaturedArtistsHero } from '@/src/components/ui/FeaturedArtistsHero'
import { useTheme } from '@/src/contexts/ThemeContext'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  Coins,
  DollarSign,
  Globe,
  Minus,
  Music,
  Play,
  Plus,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Flame,
} from 'lucide-react'
import { useState, useMemo, useCallback, useRef } from 'react'

export const Home = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { actualTheme } = useTheme()

  const toggleFaq = useCallback((id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }, [openFaq])

  // Get theme-appropriate hero image
  const getHeroImage = useCallback(() => {
    switch (actualTheme) {
      case 'light':
        return '/blockify_plain_hero_light.png'
      case 'dim':
        return '/blockify_plain_hero_dim.png'
      case 'dark':
        return '/blockify_plain_hero_dark.png'
      default:
        return '/blockify_plain_hero_dim.png'
    }
  }, [actualTheme])


  // Memoize static animation values to prevent recalculation
  const staticParticles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 1200,
      initialY: 900,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }))
  }, [])

  const staticGradientParticles = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 1200,
      initialY: 900,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 10,
    }))
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            key={actualTheme} // Force re-render when theme changes
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${getHeroImage()})` }}
          />
          {/* Subtle animated overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-accent/20"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.5, 0.7] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>

        {/* Enhanced Gradient Overlay for better text readability */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/15"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.4, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {/* Watermark Cover - Full Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/95 to-transparent z-30" />

        {/* Optimized Floating Animation - Reduced particle count */}
        <div className="absolute inset-0 pointer-events-none">
          {staticParticles.map((particle) => (
            <motion.div
              key={`floating-note-${particle.id}`}
              className="absolute w-2 h-2 bg-primary/30 rounded-full shadow-lg shadow-primary/20"
              initial={{
                x: particle.initialX,
                y: particle.initialY,
              }}
              animate={{
                y: -100,
                x: particle.initialX + 100,
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
                delay: particle.delay,
              }}
            />
          ))}

          {/* Reduced gradient particles */}
          {staticGradientParticles.map((particle) => (
            <motion.div
              key={`gradient-particle-${particle.id}`}
              className="absolute w-3 h-3 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-sm"
              initial={{
                x: particle.initialX,
                y: particle.initialY,
                scale: 0.5,
              }}
              animate={{
                y: -200,
                x: particle.initialX + 150,
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 flex items-start justify-center w-full h-full px-6 sm:px-8 lg:px-12 xl:px-16 gap-12 pt-8 sm:pt-12 lg:pt-16">
          {/* Main content - Left side */}
          <div className="flex-1 max-w-3xl text-center lg:text-left lg:mr-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              {/* Hero Content */}
              <div className="space-y-6">
                {/* Logo Image */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="flex justify-center lg:justify-start mb-6"
                >
                  <img 
                    src="/logotext.png" 
                    alt="Blockify" 
                    className="h-16 sm:h-20 md:h-24 lg:h-40 w-auto object-contain"
                  />
                </motion.div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-left">
                  <span className="gradient-text drop-shadow-lg">
                    Decentralized Music
                  </span>
                  <br />
                  <span className="text-foreground drop-shadow-lg">Ownership Platform</span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
                  Invest in music, earn BLOK coins, and build your portfolio.
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
                    Where blockchain meets beat drops.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start justify-center lg:justify-start">
                  <Link to="/marketplace">
                    <Button
                      size="lg"
                      variant="default"
                      className="btn-primary px-8 py-4 text-lg w-full sm:w-auto"
                    >
                      Explore Music
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-border/30 text-foreground hover:bg-accent/20 backdrop-blur-xl shadow-lg px-8 py-4 text-lg w-full sm:w-auto bg-card/20"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Live Stats Ticker - Under main content 
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-8"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mx-auto lg:mx-0 lg:max-w-3xl">
                  {[
                    { icon: Music, label: 'Songs Listed', value: '234', change: '+12' },
                    { icon: Users, label: 'Active Holders', value: '1,847', change: '+124' },
                    { icon: DollarSign, label: 'Total Earned', value: '$48.3K', change: '+$2.1K' },
                    { icon: TrendingUp, label: 'BLOK Price', value: '$0.024', change: '+8.4%' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card className="p-2 sm:p-3 lg:p-4 bg-card/30 backdrop-blur-md border-border/20 hover:bg-card/50 transition-all duration-300 shadow-xl shadow-primary/10">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            <Badge
                              variant="secondary"
                              className="text-xs bg-accent/20 text-accent-foreground border-accent/30"
                            >
                              {stat.change}
                            </Badge>
                          </div>
                          <p className="text-sm sm:text-base lg:text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div> */}
            </motion.div>
          </div>

          {/* Featured Artists - Right side */}
          <div className="hidden lg:block flex-shrink-0 self-start">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              className="sticky top-4 -mt-16"
            >
              <FeaturedArtistsHero />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced Modern Design */}
      <section className="relative py-24 overflow-hidden bg-background">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Minimal floating elements - reduced count */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={`floating-${i}`}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: 200 + (i * 300),
                y: 400,
              }}
              animate={{
                y: [400, 250, 400],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 20 + (i * 5),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Enhanced Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 px-6 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                YOUR JOURNEY
              </Badge>
              <Badge className="bg-gradient-to-r from-accent/20 to-primary/20 text-accent border-accent/30 px-6 py-2">
                <Target className="w-4 h-4 mr-2" />
                3 SIMPLE STEPS
              </Badge>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              How Music{' '}
              <span className="gradient-text">
                Ownership
              </span>
              <br />
              Actually Works
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Transform from a passive listener to an active stakeholder in the music industry. 
              <span className="text-primary font-semibold"> Earn while artists succeed. </span>
            </p>
          </motion.div>

          {/* Enhanced Interactive Timeline */}
          <div className="relative max-w-8xl mx-auto">
            {/* Enhanced Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary rounded-full transform -translate-y-1/2 hidden lg:block shadow-lg" />
            <motion.div 
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-primary via-accent to-primary rounded-full transform -translate-y-1/2 hidden lg:block shadow-2xl shadow-primary/50"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
            />
            
            {/* Simplified flowing particle */}
            <motion.div
              className="absolute top-1/2 left-0 w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full transform -translate-y-1/2 hidden lg:block shadow-lg"
              animate={{
                x: [0, 800, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="grid lg:grid-cols-3 gap-16 lg:gap-16">
              {[
                {
                  step: '01',
                  title: 'Discover & Choose',
                  subtitle: 'Your Perfect Music Investment',
                  description:
                    'Browse our curated marketplace of exclusive music NFTs. Each track offers different ownership tiers with varying benefits and earning potential.',
                  features: [
                    '🎵 Exclusive track collections',
                    '💎 4 investment tiers available',
                    '📊 Real-time analytics',
                    '🏆 Verified artist partnerships',
                  ],
                  stats: { label: 'Avg ROI', value: '24.5%' },
                  color: 'from-primary to-accent',
                  bgGlow: 'shadow-primary/30',
                  icon: Target,
                  delay: 0,
                },
                {
                  step: '02',
                  title: 'Purchase & Own',
                  subtitle: 'Secure Your Stake',
                  description:
                    'Instantly mint your NFT and receive BLOK tokens representing your ownership stake. Your investment is secured on the blockchain forever.',
                  features: [
                    '⚡ Instant blockchain minting',
                    '🪙 BLOK token rewards',
                    '🔒 Immutable ownership proof',
                    '📜 Smart contract verified',
                  ],
                  stats: { label: 'Avg Fee', value: '0.02 ETH' },
                  color: 'from-accent to-primary',
                  bgGlow: 'shadow-accent/30',
                  icon: Wallet,
                  delay: 0.2,
                },
                {
                  step: '03',
                  title: 'Earn & Grow',
                  subtitle: 'Passive Revenue Streams',
                  description:
                    'Watch your investment grow as the music gains popularity. Earn from streaming, licensing, sync deals, and secondary sales automatically.',
                  features: [
                    '💰 Monthly revenue distributions',
                    '📈 Compound growth potential',
                    '🌍 Global licensing income',
                    '🔄 Automated collections',
                  ],
                  stats: { label: 'Top Earner', value: '$12.8K' },
                  color: 'from-primary to-accent',
                  bgGlow: 'shadow-primary/30',
                  icon: Coins,
                  delay: 0.4,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 60, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay, duration: 0.8, type: 'spring', bounce: 0.4 }}
                  whileHover={{ y: -20, scale: 1.05 }}
                  className="relative group"
                >

                  {/* Enhanced Main Card */}
                  <Card
                    className={`relative py-10 px-8 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 group-hover:shadow-2xl ${item.bgGlow} min-h-[550px] overflow-hidden`}
                  >
                    {/* Animated gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Simplified hover effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />

                    <CardContent className="p-0 text-center h-full flex flex-col relative z-10">
                      {/* Enhanced Icon Section */}
                      <div className="flex-shrink-0 mb-6">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.8 }}
                          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-2xl ring-4 ring-white/10 group-hover:ring-white/30 transition-all duration-500`}
                        >
                          <item.icon className="w-12 h-12 text-primary-foreground" />
                        </motion.div>

                        <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-lg text-primary/80 font-medium mb-4">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Stats Badge */}
                      <div className="flex justify-center mb-6">
                        <Badge className={`bg-gradient-to-r ${item.color} text-primary-foreground border-0 px-6 py-2 text-sm font-bold shadow-lg`}>
                          {item.stats.label}: {item.stats.value}
                        </Badge>
                      </div>

                      {/* Description */}
                      <div className="flex-grow flex items-start mb-6">
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {item.description}
                        </p>
                      </div>

                      {/* Enhanced Feature List */}
                      <div className="flex-shrink-0 space-y-4">
                        {item.features.map((feature, i) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: item.delay + 0.1 * (i + 1) }}
                            viewport={{ once: true }}
                            className="flex items-center justify-start gap-3 text-left"
                          >
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0`}>
                              <CheckCircle className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="text-sm text-foreground group-hover:text-primary transition-colors font-medium">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Arrow Connection */}
                  {index < 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: item.delay + 0.6, duration: 0.8 }}
                      className="absolute top-1/2 -right-8 transform -translate-y-1/2 hidden lg:block z-30"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center shadow-2xl ring-4 ring-white/20 hover:ring-white/40 transition-all duration-300`}
                      >
                        <ArrowRight className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="text-center mt-24"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mb-12"
              >
                <h3 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to{' '}
                  <span className="gradient-text">
                    Own the Beat?
                  </span>
                </h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of music lovers who are already earning from their favorite tracks
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link to="/marketplace">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="btn-primary px-12 py-6 text-xl rounded-full group"
                    >
                      <Sparkles className="mr-3 w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                      Start Investing Now
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </motion.div>
                </Link>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-border/30 text-foreground hover:bg-accent/20 backdrop-blur-xl px-12 py-6 text-xl rounded-full group"
                  >
                    <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    Watch Demo
                  </Button>
                </motion.div>
              </div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  <span>12.8K+ Happy Investors</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>24.5% Avg ROI</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Artist Signup Section */}
      <section className="relative py-32 bg-background overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Minimal floating elements for artist section */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={`artist-float-${i}`}
              className="absolute w-3 h-3 bg-emerald-400/30 rounded-full shadow-lg shadow-emerald-500/20"
              initial={{
                x: 300 + (i * 400),
                y: 300,
              }}
              animate={{
                y: [300, 200, 300],
                opacity: [0.3, 0.6, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 15 + (i * 3),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 px-6 py-2">
                <Music className="w-4 h-4 mr-2" />
                FOR ARTISTS
              </Badge>
              <Badge className="bg-gradient-to-r from-accent/20 to-primary/20 text-accent border-accent/30 px-6 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                EARN MORE
              </Badge>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Turn Your Music Into{' '}
              <span className="gradient-text">
                Revenue Streams
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join BLOK and let your fans invest in your success. 
              <span className="text-primary font-semibold"> Create NFTs, earn royalties, and build a sustainable music career. </span>
            </p>
          </motion.div>

          {/* Artist Benefits Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: DollarSign,
                title: 'Multiple Revenue Streams',
                description: 'Earn from NFT sales, streaming royalties, licensing deals, and fan investments. Your music works for you 24/7.',
                features: ['NFT Primary Sales', 'Streaming Royalties', 'Sync & Licensing', 'Secondary Market Fees'],
                color: 'from-primary to-accent',
                bgGlow: 'shadow-primary/20'
              },
              {
                icon: Users,
                title: 'Direct Fan Connection',
                description: 'Build a community of invested fans who share in your success. Give them exclusive perks and experiences.',
                features: ['Fan Investment', 'Exclusive Access', 'Community Building', 'Voting Rights'],
                color: 'from-accent to-primary',
                bgGlow: 'shadow-accent/20'
              },
              {
                icon: TrendingUp,
                title: 'Platform Growth',
                description: 'Grow your career with our tools, analytics, and promotional support. We succeed when you succeed.',
                features: ['Analytics Dashboard', 'Promotional Support', 'Career Tools', 'Industry Connections'],
                color: 'from-primary to-accent',
                bgGlow: 'shadow-cyan-500/20'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className={`p-8 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-2xl border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 group-hover:shadow-2xl ${benefit.bgGlow} min-h-[400px]`}>
                  <CardContent className="p-0 text-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-white/10 group-hover:ring-white/20 transition-all duration-500`}
                    >
                      <benefit.icon className="w-10 h-10 text-primary-foreground" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {benefit.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {benefit.features.map((feature, i) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * (i + 1) }}
                          viewport={{ once: true }}
                          className="flex items-center justify-center gap-3"
                        >
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${benefit.color} flex items-center justify-center flex-shrink-0`}>
                            <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          </div>
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors font-medium">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Artist CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Card className="p-12 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 backdrop-blur-xl">
                  <CardContent className="p-0">
                    <h3 className="text-4xl md:text-5xl font-bold mb-6">
                      Ready to{' '}
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Monetize
                      </span>{' '}
                      Your Talent?
                    </h3>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                      Join hundreds of artists who are already earning sustainable income from their music on BLOK
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                      <Link to="/artist/signup">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-primary   to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 px-12 py-6 text-xl rounded-full group"
                          >
                            <Music className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
                            Start Your Artist Journey
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </motion.div>
                      </Link>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-primary/30 text-primary hover:bg-primary/10 backdrop-blur-xl px-12 py-6 text-xl rounded-full group"
                        >
                          <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                          See Artist Success Stories
                        </Button>
                      </motion.div>
                    </div>

                    {/* Artist Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Music className="w-5 h-5 text-primary" />
                        <span>350+ Artists Earning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <span>$480K+ Distributed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span>15% Avg Monthly Growth</span>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured NFTs */}
      <FeaturedNFTs />

      {/* FAQ Section */}
      <section className="relative py-32 bg-background overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-background" />

        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30 px-6 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Questions & Answers
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about owning music NFTs and earning royalties
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* FAQ Categories */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* General Questions */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Music className="w-6 h-6 text-primary" />
                  General Questions
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 'general-1',
                      question: 'What exactly am I buying when I purchase a music NFT?',
                      answer:
                        "When you purchase a music NFT on BLOK, you're buying a percentage of ownership in that specific song. This includes rights to future royalties from streaming, licensing, and sales. You also receive BLOK tokens that represent your stake in the platform's success.",
                    },
                    {
                      id: 'general-2',
                      question: 'How do the different tiers (Bronze, Silver, Gold, Platinum) work?',
                      answer:
                        'Each tier represents different ownership percentages and benefits: Bronze (1-5% ownership), Silver (6-15%), Gold (16-30%), and Platinum (31-50%). Higher tiers offer greater royalty percentages, exclusive perks, and voting rights on platform decisions.',
                    },
                    {
                      id: 'general-3',
                      question: 'Can I sell my music NFT later?',
                      answer:
                        'Absolutely! Your music NFTs are fully tradeable on our marketplace and compatible with other NFT platforms. You can list them for sale at any time, and the new owner will inherit all royalty rights.',
                    },
                  ].map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                          {openFaq === faq.id ? (
                            <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          )}
                        </button>
                        <AnimatePresence>
                          {openFaq === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Financial Questions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  Earnings & Finance
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 'finance-1',
                      question: 'How often do I receive royalty payments?',
                      answer:
                        'Royalty distributions happen monthly, automatically sent to your wallet. You can track your earnings in real-time through your portfolio dashboard, and claim them at any time.',
                    },
                    {
                      id: 'finance-2',
                      question: 'What determines how much I earn from royalties?',
                      answer:
                        "Your earnings depend on your ownership percentage, the song's performance (streams, sales, licensing deals), and overall market activity. Popular songs with high streaming numbers generate more royalties for all holders.",
                    },
                    {
                      id: 'finance-3',
                      question: 'Are there any fees for holding or trading NFTs?',
                      answer:
                        'There are no holding fees - your NFTs are yours forever. Trading fees are minimal (2.5%) and only apply when buying/selling. All blockchain transaction costs are transparently displayed before confirmation.',
                    },
                    {
                      id: 'finance-4',
                      question: 'What are BLOK tokens and how do I use them?',
                      answer:
                        "BLOK tokens are the platform's native currency. You earn them through NFT ownership, can stake them for additional rewards, use them for governance voting, and trade them on decentralized exchanges.",
                    },
                  ].map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                          {openFaq === faq.id ? (
                            <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </button>
                        <AnimatePresence>
                          {openFaq === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Technical Questions - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center">
                <Globe className="w-6 h-6 text-primary" />
                Technical & Platform
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'tech-1',
                    question: 'Which blockchain does BLOK use?',
                    answer:
                      'BLOK is built on Ethereum for maximum security and compatibility. We also support Layer 2 solutions like Polygon for lower transaction fees. Your NFTs are fully compatible with all major wallets and marketplaces.',
                  },
                  {
                    id: 'tech-2',
                    question: 'Do I need crypto experience to get started?',
                    answer:
                      'Not at all! Our platform is designed for music lovers, not crypto experts. We provide step-by-step guidance for wallet setup, and our support team is available 24/7. You can even purchase using credit cards through our partners.',
                  },
                  {
                    id: 'tech-3',
                    question: 'How do you ensure the music rights are legitimate?',
                    answer:
                      'Every song goes through rigorous verification with artists, labels, and rights organizations. We use blockchain technology to create immutable ownership records and work only with verified artists and rights holders.',
                  },
                  {
                    id: 'tech-4',
                    question: 'What happens if an artist removes their music?',
                    answer:
                      "Your ownership rights remain valid even if music is removed from streaming platforms. Your NFTs represent permanent ownership stakes, and you'll continue earning from any future licensing, sales, or re-releases.",
                  },
                ].map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                        {openFaq === faq.id ? (
                          <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {openFaq === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our team is here to help you understand every aspect of music ownership on BLOK
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Shield className="mr-2 w-4 h-4" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Globe className="mr-2 w-4 h-4" />
                  Join Discord
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your <span className="gradient-text">Music Journey?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of music lovers who are already earning from their passion.
            </p>
            <Button
              size="lg"
              variant="default"
              className="text-lg px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
