import { FeaturedNFTs } from '@/src/components/demo/FeaturedNFTs'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { FeaturedArtistsHero } from '@/src/components/ui/FeaturedArtistsHero'
import Spline from '@splinetool/react-spline'
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
import { useState } from 'react'

export const Home = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Spline 3D Scene Background */}
        <div className="absolute inset-0 w-full h-full">
          <Spline
            scene="https://prod.spline.design/xQeXGXgGqdq2Zwuv/scene.splinecode"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

        {/* Watermark Cover - Full Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/95 to-transparent z-30" />

        {/* Floating Music Notes Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }, (_, i) => {
            const uniqueId = Math.random().toString(36).substr(2, 9)
            return (
              <motion.div
                key={`floating-note-${i}-${uniqueId}`}
                className="absolute w-2 h-2 bg-purple-400/40 rounded-full shadow-lg shadow-purple-500/20"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 900,
                }}
                animate={{
                  y: -100,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                  delay: Math.random() * 5,
                }}
              />
            )
          })}

          {/* Additional gradient particles for depth */}
          {Array.from({ length: 8 }, (_, i) => {
            const uniqueId = Math.random().toString(36).substr(2, 9)
            return (
              <motion.div
                key={`gradient-particle-${i}-${uniqueId}`}
                className="absolute w-3 h-3 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-sm"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 900,
                  scale: 0.5,
                }}
                animate={{
                  y: -200,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: Math.random() * 25 + 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: Math.random() * 10,
                }}
              />
            )
          })}
        </div>

        {/* Content */}
        <div className="relative z-20 flex items-start justify-center w-full h-full px-6 sm:px-8 lg:px-12 xl:px-16 gap-12 pt-16 sm:pt-20 lg:pt-24">
          {/* Main content - Left side */}
          <div className="flex-1 max-w-3xl text-center lg:text-left lg:mr-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              {/* Hero Content */}
              <div className="space-y-8">
                {/* Live Indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-400">LIVE MARKETPLACE</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-400">HOT TRACKS</span>
                  </div>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-center lg:text-left">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                    Own the Music
                  </span>
                  <br />
                  <span className="text-foreground drop-shadow-lg">Earn the Royalties</span>
                </h1>

                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 max-w-4xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
                  Buy music NFTs, earn PAGS tokens, and share in the success of your favorite
                  artists.
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                    The first platform where fans become stakeholders.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-center lg:items-start justify-center lg:justify-start">
                  <Link to="/marketplace">
                    <Button
                      size="lg"
                      variant="default"
                      className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl w-full sm:w-auto overflow-hidden group"
                    >
                      Explore Music
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-border/30 text-foreground hover:bg-accent/20 backdrop-blur-xl shadow-lg px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl w-full sm:w-auto bg-card/20"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="relative"
                >
                  <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">✓</span>
                      </div>
                      <span>Instant NFT Trading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">$</span>
                      </div>
                      <span>Automated Royalties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">⚡</span>
                      </div>
                      <span>Low Gas Fees</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Live Stats Ticker - Under main content */}
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
                    { icon: TrendingUp, label: 'PAGS Price', value: '$0.024', change: '+8.4%' },
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
                              className="text-xs bg-green-500/20 text-green-300 border-green-500/30"
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
              </motion.div>
            </motion.div>
          </div>

          {/* Featured Artists - Right side */}
          <div className="hidden lg:block flex-shrink-0 self-start">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              className="sticky top-4"
            >
              <FeaturedArtistsHero />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Completely Redesigned */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/10 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent)] opacity-50" />

        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-400/30 px-6 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Your Journey to Music Ownership
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              How It{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform from a music listener to a music owner in three revolutionary steps
            </p>
          </motion.div>

          {/* Interactive Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 rounded-full transform -translate-y-1/2 hidden lg:block" />
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 rounded-full transform -translate-y-1/2 animate-pulse opacity-50 hidden lg:block" />

            <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
              {[
                {
                  step: '01',
                  title: 'Choose Your Investment Tier',
                  description:
                    'Select from Bronze, Silver, Gold, or Platinum NFTs. Each tier offers different ownership percentages and earning potentials.',
                  features: [
                    'Different price points',
                    'Varying ownership %',
                    'Exclusive benefits',
                    'Limited quantities',
                  ],
                  color: 'from-orange-400 to-red-500',
                  bgGlow: 'shadow-orange-500/30',
                  icon: Target,
                  delay: 0,
                },
                {
                  step: '02',
                  title: 'Mint & Secure Ownership',
                  description:
                    'Purchase your chosen NFT tier to officially own a piece of the song and receive PAGS tokens representing your stake.',
                  features: [
                    'Instant NFT minting',
                    'PAGS token rewards',
                    'Blockchain verified',
                    'Ownership certificate',
                  ],
                  color: 'from-purple-400 to-pink-500',
                  bgGlow: 'shadow-purple-500/30',
                  icon: Wallet,
                  delay: 0.2,
                },
                {
                  step: '03',
                  title: 'Earn Passive Royalties',
                  description:
                    'Start earning immediately from streams, sales, and licensing. Your PAGS tokens automatically collect royalties forever.',
                  features: [
                    'Monthly distributions',
                    'Real-time tracking',
                    'Multiple revenue streams',
                    'Compound earnings',
                  ],
                  color: 'from-cyan-400 to-blue-500',
                  bgGlow: 'shadow-cyan-500/30',
                  icon: Coins,
                  delay: 0.4,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay, duration: 0.8, type: 'spring', bounce: 0.3 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center shadow-2xl ${item.bgGlow} group-hover:shadow-xl transition-all duration-500`}
                    >
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                  </div>

                  {/* Main Card */}
                  <Card
                    className={`relative pt-12 pb-8 px-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-2 border-white/10 hover:border-white/20 transition-all duration-500 group-hover:shadow-2xl ${item.bgGlow} h-[500px]`}
                  >
                    <CardContent className="p-0 text-center h-full flex flex-col">
                      {/* Top Section: Icon and Title */}
                      <div className="flex-shrink-0">
                        {/* Animated Icon */}
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-6 shadow-xl`}
                        >
                          <item.icon className="w-10 h-10 text-white" />
                        </motion.div>

                        <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>
                      </div>

                      {/* Middle Section: Description (flexible) */}
                      <div className="flex-grow flex items-center">
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>

                      {/* Bottom Section: Feature List */}
                      <div className="flex-shrink-0 space-y-3 mt-6">
                        {item.features.map((feature, i) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: item.delay + 0.1 * (i + 1) }}
                            viewport={{ once: true }}
                            className="flex items-center justify-center gap-2"
                          >
                            <CheckCircle className={'w-4 h-4 text-green-400'} />
                            <span className="text-sm text-muted-foreground group-hover:text-gray-300 transition-colors">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>

                    {/* Hover Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-500`}
                    />
                  </Card>

                  {/* Arrow Connection (Desktop) */}
                  {index < 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: item.delay + 0.5 }}
                      className="absolute top-1/2 -right-6 transform -translate-y-1/2 hidden lg:block z-30"
                    >
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center shadow-xl`}
                      >
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-20"
          >
            <Link to="/marketplace">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 px-12 py-6 text-xl rounded-full"
              >
                Start Your Journey
                <Sparkles className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured NFTs */}
      <FeaturedNFTs />

      {/* FAQ Section */}
      <section className="relative py-32 bg-gradient-to-b from-background to-purple-950/20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.1),transparent)] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.1),transparent)] opacity-60" />

        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-400/30 px-6 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Questions & Answers
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
                  <Music className="w-6 h-6 text-purple-400" />
                  General Questions
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 'general-1',
                      question: 'What exactly am I buying when I purchase a music NFT?',
                      answer:
                        "When you purchase a music NFT on PAGS, you're buying a percentage of ownership in that specific song. This includes rights to future royalties from streaming, licensing, and sales. You also receive PAGS tokens that represent your stake in the platform's success.",
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
                            <Minus className="w-5 h-5 text-purple-400 flex-shrink-0" />
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
                  <DollarSign className="w-6 h-6 text-green-400" />
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
                      question: 'What are PAGS tokens and how do I use them?',
                      answer:
                        "PAGS tokens are the platform's native currency. You earn them through NFT ownership, can stake them for additional rewards, use them for governance voting, and trade them on decentralized exchanges.",
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
                            <Minus className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-green-400 flex-shrink-0" />
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
                <Globe className="w-6 h-6 text-cyan-400" />
                Technical & Platform
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'tech-1',
                    question: 'Which blockchain does PAGS use?',
                    answer:
                      'PAGS is built on Ethereum for maximum security and compatibility. We also support Layer 2 solutions like Polygon for lower transaction fees. Your NFTs are fully compatible with all major wallets and marketplaces.',
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
                          <Minus className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-cyan-400 flex-shrink-0" />
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
              className="text-center mt-16 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our team is here to help you understand every aspect of music ownership on PAGS
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
      <section className="py-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
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
              className="text-lg px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
