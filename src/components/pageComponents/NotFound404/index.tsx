import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Music } from 'lucide-react'

export function NotFound404() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 404 Animation */}
            <div className="mb-8">
              <motion.div
                className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                404
              </motion.div>
            </div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Looks like this track has been removed from the playlist.
              </p>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </motion.div>

            {/* Suggested Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">What would you like to do?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/">
                      <Button
                        variant="outline"
                        className="w-full h-16 flex-col gap-2"
                      >
                        <Home className="w-5 h-5" />
                        <span>Go Home</span>
                      </Button>
                    </Link>

                    <Link to="/marketplace">
                      <Button
                        variant="outline"
                        className="w-full h-16 flex-col gap-2"
                      >
                        <Music className="w-5 h-5" />
                        <span>Browse Music</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>

                <Link to="/">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 5 }, () => (
                <motion.div
                  key={`floating-${Math.random().toString(36).substr(2, 9)}`}
                  className="absolute w-4 h-4 bg-purple-500/20 rounded-full"
                  animate={{
                    x: [0, Math.random() * 200 - 100],
                    y: [0, Math.random() * 200 - 100],
                    scale: [1, Math.random() + 0.5],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
