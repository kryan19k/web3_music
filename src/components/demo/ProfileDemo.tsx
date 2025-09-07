import { ProfileModal } from '@/src/components/profile/ProfileModal'
import { Button } from '@/src/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function ProfileDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4">Your Music, Your Profile</h2>
          <p className="text-muted-foreground mb-8">
            Create a personalized profile to showcase your music collection, track earnings, and
            connect with the community.
          </p>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            View Profile Demo
          </Button>
        </motion.div>

        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  )
}
