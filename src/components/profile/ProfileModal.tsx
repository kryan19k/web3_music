import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/custom-tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Clock,
  DollarSign,
  Headphones,
  Music,
  Settings,
  Star,
  TrendingUp,
  User,
} from 'lucide-react'
import { useState } from 'react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const mockProfile = {
    name: 'Alex Cooper',
    username: 'alex-cooper',
    avatar: '/api/placeholder/100/100',
    bio: 'Music enthusiast and NFT collector. Always looking for the next breakthrough artist!',
    verified: false,
    stats: {
      nftsOwned: 24,
      totalSpent: 2847.5,
      blokEarned: 1250,
      totalPlays: 45680,
      joinedDate: 'Jan 2024',
    },
  }

  const achievements = [
    { name: 'First Purchase', icon: '🎵', description: 'Made your first NFT purchase' },
    { name: 'Music Lover', icon: '❤️', description: 'Listened to 100+ hours' },
    { name: 'Early Adopter', icon: '🚀', description: 'Joined in the first month' },
    { name: 'Collector', icon: '💎', description: 'Own 10+ NFTs' },
  ]

  const recentActivity = [
    { action: 'Purchased', item: 'Synthwave Dreams', time: '2 hours ago' },
    { action: 'Liked', item: 'Midnight Echoes', time: '5 hours ago' },
    { action: 'Followed', item: 'Luna Vista', time: '1 day ago' },
  ]

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={mockProfile.avatar} />
              <AvatarFallback className="text-xl">{mockProfile.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{mockProfile.name}</h2>
                {mockProfile.verified && (
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    <Award className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">@{mockProfile.username}</p>
              <p className="text-sm">{mockProfile.bio}</p>
            </div>

            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Music className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="font-bold text-xl">{mockProfile.stats.nftsOwned}</div>
                <div className="text-sm text-muted-foreground">NFTs Owned</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-bold text-xl">
                  ${mockProfile.stats.totalSpent.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="font-bold text-xl">
                  {mockProfile.stats.blokEarned.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">BLOK Earned</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Headphones className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-bold text-xl">
                  {mockProfile.stats.totalPlays.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Plays</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Quick Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Member since:</span>
                        <span>{mockProfile.stats.joinedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Favorite genre:</span>
                        <span>Electronic</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collection value:</span>
                        <span className="text-primary">
                          ${mockProfile.stats.totalSpent.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Recent Milestones</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🎵</span>
                        <span>First NFT purchase</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">💎</span>
                        <span>Collector status unlocked</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🔥</span>
                        <span>100+ hours streamed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="achievements"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="cursor-pointer border-2 border-transparent hover:border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{achievement.icon}</span>
                          <div>
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="activity"
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={`${activity.action}-${activity.item}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <div>
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-muted-foreground"> {activity.item}</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
