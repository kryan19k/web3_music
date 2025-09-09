import { motion } from 'framer-motion'
import { useEffect, useState, useCallback, useMemo } from 'react'

interface WaveformProps {
  className?: string
}

export const InteractiveWaveform = ({ className = '' }: WaveformProps) => {
  const [audioData, setAudioData] = useState<number[]>([])

  // Reduce bars for better performance
  const barCount = 80

  // Generate random waveform data with better performance
  useEffect(() => {
    const generateWaveform = () => {
      const newData = Array.from({ length: barCount }, () => Math.random() * 100 + 20)
      setAudioData(newData)
    }

    generateWaveform()
    const interval = setInterval(generateWaveform, 200) // Slower updates

    return () => clearInterval(interval)
  }, [barCount])

  // Throttled mouse interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-teal-900/20 to-green-900/30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Large Central Waveform Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end gap-2 h-4/5 w-full max-w-5xl px-8">
          {audioData.map((height, index) => {
            const barWidth = Math.max(6, (window.innerWidth || 1200) / barCount - 2)
            const distance = Math.abs(mousePosition.x - (index * barWidth + barWidth / 2))
            const proximityEffect = Math.max(0, 200 - distance / 2)
            const finalHeight = Math.max(20, height + proximityEffect * 0.3)

            return (
              <motion.div
                key={index}
                className="relative flex-1"
                style={{ minWidth: `${barWidth}px` }}
              >
                {/* Main bar with varied colors */}
                <motion.div
                  className={`${
                    index % 4 === 0 ? 'bg-gradient-to-t from-cyan-500 via-blue-400 to-teal-300' :
                    index % 4 === 1 ? 'bg-gradient-to-t from-green-500 via-emerald-400 to-cyan-300' :
                    index % 4 === 2 ? 'bg-gradient-to-t from-blue-500 via-indigo-400 to-cyan-300' :
                    'bg-gradient-to-t from-teal-500 via-cyan-400 to-blue-300'
                  } rounded-t-lg`}
                  animate={{
                    height: `${finalHeight}%`,
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    height: { duration: 0.2 },
                    opacity: { duration: 1.2, repeat: Infinity },
                  }}
                  style={{
                    boxShadow: `0 0 ${proximityEffect / 15}px rgba(6, 182, 212, 0.4)`,
                  }}
                />
                
                {/* Glow effect */}
                <motion.div
                  className="bg-gradient-to-b from-cyan-400/20 via-blue-400/10 to-transparent rounded-b-lg mt-1"
                  animate={{
                    height: `${finalHeight * 0.4}%`,
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    height: { duration: 0.2 },
                    opacity: { duration: 1.2, repeat: Infinity },
                  }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Reduced Floating Particles for Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0 ? 'bg-cyan-400/40' :
              i % 3 === 1 ? 'bg-blue-400/40' :
              'bg-teal-400/40'
            }`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: [0.5, 1.2, 0.5],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Simplified Music Wave Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: 2 }, (_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border border-cyan-400/15"
            initial={{
              width: 100,
              height: 100,
              opacity: 0,
            }}
            animate={{
              width: [100, 600],
              height: [100, 600],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Interactive Glow Effect with Better Colors */}
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-500/15 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 96,
          y: mousePosition.y - 96,
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 30,
        }}
      />
    </div>
  )
}