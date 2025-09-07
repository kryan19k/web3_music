import { FeaturedNFTs } from '@/src/components/demo/FeaturedNFTs'
import { ProfileDemo } from '@/src/components/demo/ProfileDemo'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  DollarSign,
  Headphones,
  Music,
  Play,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'

export const Home = () => {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          {/* Floating Music Notes Animation */}
          {Array.from({ length: 20 }, (_, _i) => (
            <motion.div
              key={`floating-note-${Math.random().toString(36).substr(2, 9)}`}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 900,
              }}
              animate={{
                y: -100,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto px-4">
          {/* Left side - Main content */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge
                className="mb-4"
                variant="secondary"
              >
                <Music className="w-3 h-3 mr-1" />
                Web3 Music Revolution
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Own the Music
                </span>
                <br />
                <span className="text-foreground">Earn the Royalties</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Buy music NFTs, earn PAGS tokens, and share in the success of your favorite artists.
                The first platform where fans become stakeholders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                <Link to="/marketplace">
                  <Button
                    size="lg"
                    variant="default"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Explore Music
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Watch Demo
                </Button>
              </div>

              {/* Live Stats Ticker - Under main content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between mb-2">
                            <stat.icon className="w-4 h-4 text-muted-foreground" />
                            <Badge
                              variant="secondary"
                              className="text-xs"
                            >
                              {stat.change}
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right side - Profile Demo 
          <div className="hidden lg:block flex-shrink-0 ml-8">
            <ProfileDemo />
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to start earning from music</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Choose Your Tier',
              description:
                'Select from Bronze, Silver, Gold, or Platinum NFTs based on your investment level',
              color: 'from-orange-500 to-red-500',
              icon: Headphones,
            },
            {
              step: '02',
              title: 'Mint & Own',
              description:
                'Purchase the NFT to own the song and receive PAGS tokens for royalty rights',
              color: 'from-purple-500 to-pink-500',
              icon: Zap,
            },
            {
              step: '03',
              title: 'Earn Forever',
              description:
                'Collect monthly royalties from streaming, sales, and licensing automatically',
              color: 'from-blue-500 to-cyan-500',
              icon: DollarSign,
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold`}
                    >
                      {item.step}
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity`}
                    >
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured NFTs */}
      <FeaturedNFTs />

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
