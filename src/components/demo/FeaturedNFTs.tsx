import { MusicNFTCard } from '@/src/components/nft/MusicNFTCard'
import { useAudioPlayer } from '@/src/hooks/useAudioPlayer'
import type { Track } from '@/src/hooks/useAudioPlayer'
import type { MusicNFT } from '@/src/types/music-nft'
import { motion } from 'framer-motion'

// Demo data for featured NFTs
const featuredNFTs: MusicNFT[] = [
  {
    tokenId: '1',
    tier: 'platinum',
    metadata: {
      id: '1',
      title: 'Midnight Echoes',
      artist: 'Luna Vista',
      image: '/song_cover/midnight.png',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 245,
      edition: 3,
      maxSupply: 10,
      description: 'An ethereal journey through ambient soundscapes',
      genre: 'Ambient',
      releaseDate: '2024-01-15',
      pagsAmount: 1000,
      dailyStreams: 15420,
      attributes: [
        { trait_type: 'Mood', value: 'Ethereal' },
        { trait_type: 'Tempo', value: 'Slow' },
        { trait_type: 'Key', value: 'D Minor' },
        { trait_type: 'Instruments', value: 'Synthesizer, Strings' },
      ],
    },
    price: '0.5',
    priceUSD: 892.5,
    earnings: {
      daily: 24.5,
      total: 1250.0,
      apy: 18.5,
    },
    owner: '0x742...a5c2',
    isListed: true,
    streamingStats: {
      totalPlays: 125430,
      uniqueListeners: 8940,
      averageCompletion: 87,
    },
  },
  {
    tokenId: '2',
    tier: 'gold',
    metadata: {
      id: '2',
      title: 'Electric Dreams',
      artist: 'Neon Pulse',
      image: '/song_cover/electric.png',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 198,
      edition: 47,
      maxSupply: 100,
      description: 'High-energy synthwave with retro vibes',
      genre: 'Synthwave',
      releaseDate: '2024-02-03',
      pagsAmount: 500,
      dailyStreams: 32100,
      attributes: [
        { trait_type: 'Mood', value: 'Energetic' },
        { trait_type: 'Tempo', value: 'Fast' },
        { trait_type: 'Key', value: 'E Major' },
        { trait_type: 'Instruments', value: 'Synthesizer, Drums' },
      ],
    },
    price: '0.15',
    priceUSD: 267.75,
    earnings: {
      daily: 8.9,
      total: 445.6,
      apy: 12.3,
    },
    owner: '0x1a3...f8d1',
    isListed: true,
    streamingStats: {
      totalPlays: 98750,
      uniqueListeners: 12300,
      averageCompletion: 92,
    },
  },
  {
    tokenId: '3',
    tier: 'silver',
    metadata: {
      id: '3',
      title: 'Urban Jungle',
      artist: 'Street Symphony',
      image: '/song_cover/urban.png',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 312,
      edition: 234,
      maxSupply: 500,
      description: 'Raw hip-hop beats from the concrete streets',
      genre: 'Hip Hop',
      releaseDate: '2024-01-28',
      pagsAmount: 250,
      dailyStreams: 45600,
      attributes: [
        { trait_type: 'Mood', value: 'Aggressive' },
        { trait_type: 'Tempo', value: 'Medium' },
        { trait_type: 'Key', value: 'G Minor' },
        { trait_type: 'Instruments', value: 'Drums, Bass, Vocals' },
      ],
    },
    price: '0.08',
    priceUSD: 142.8,
    earnings: {
      daily: 4.2,
      total: 189.5,
      apy: 9.8,
    },
    owner: '0x9c7...b2e4',
    isListed: true,
    streamingStats: {
      totalPlays: 156780,
      uniqueListeners: 18950,
      averageCompletion: 78,
    },
  },
  {
    tokenId: '4',
    tier: 'bronze',
    metadata: {
      id: '4',
      title: 'Coffee Shop Vibes',
      artist: 'Mellow Mornings',
      image: '/song_cover/coffee.png',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 187,
      edition: 678,
      maxSupply: 1000,
      description: 'Relaxing acoustic melodies for peaceful moments',
      genre: 'Acoustic',
      releaseDate: '2024-02-10',
      pagsAmount: 100,
      dailyStreams: 28340,
      attributes: [
        { trait_type: 'Mood', value: 'Relaxing' },
        { trait_type: 'Tempo', value: 'Slow' },
        { trait_type: 'Key', value: 'C Major' },
        { trait_type: 'Instruments', value: 'Guitar, Piano' },
      ],
    },
    price: '0.025',
    priceUSD: 44.63,
    earnings: {
      daily: 1.85,
      total: 67.2,
      apy: 6.2,
    },
    owner: '0x4f1...d9a3',
    isListed: true,
    streamingStats: {
      totalPlays: 89430,
      uniqueListeners: 14200,
      averageCompletion: 94,
    },
  },
]

export function FeaturedNFTs() {
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()

  const handlePlay = (audioUrl: string) => {
    const nft = featuredNFTs.find((n) => n.metadata.audioUrl === audioUrl)
    if (nft) {
      const track: Track = {
        id: nft.tokenId,
        title: nft.metadata.title,
        artist: nft.metadata.artist,
        artwork: nft.metadata.image || '/song_cover/midnight.png',
        audioUrl: nft.metadata.audioUrl,
        duration: nft.metadata.duration,
        pagsPerStream: nft.metadata.pagsAmount / 1000, // Convert to per stream
      }
      play(track)
    }
  }

  const handlePause = () => {
    pause()
  }

  const handlePurchase = (tokenId: string) => {
    console.log('Purchase NFT:', tokenId)
    // In a real app, this would open the purchase modal
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Music NFTs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exclusive tracks from top artists and start earning royalties today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredNFTs.map((nft, index) => (
            <motion.div
              key={nft.tokenId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <MusicNFTCard
                nft={nft}
                isPlaying={currentTrack?.id === nft.tokenId && isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                onPurchase={handlePurchase}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            type="button"
            className="text-primary hover:text-primary/80 font-medium"
          >
            View All NFTs →
          </button>
        </motion.div>
      </div>
    </section>
  )
}
