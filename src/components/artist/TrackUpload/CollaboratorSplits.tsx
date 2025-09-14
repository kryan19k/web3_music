/**
 * Collaborator Splits Component
 * Allows artists to define revenue splits for collaborators
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { 
  Users, 
  Plus, 
  X, 
  Percent, 
  AlertTriangle, 
  Check,
  Music,
  DollarSign,
  Info,
  UserCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export interface Collaborator {
  id: string
  name: string
  walletAddress: string
  percentage: number
  role: string
}

interface CollaboratorSplitsProps {
  collaborators: Collaborator[]
  onCollaboratorsChange: (collaborators: Collaborator[]) => void
  className?: string
}

export function CollaboratorSplits({ 
  collaborators, 
  onCollaboratorsChange,
  className = ""
}: CollaboratorSplitsProps) {
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false)
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    walletAddress: '',
    percentage: 0,
    role: ''
  })

  // Calculate total percentage
  const totalPercentage = collaborators.reduce((sum, collab) => sum + collab.percentage, 0)
  const remainingPercentage = Math.max(0, 100 - totalPercentage)
  const isValidSplit = totalPercentage <= 100

  const handleAddCollaborator = () => {
    // Validation
    if (!newCollaborator.name.trim()) {
      toast.error('Please enter collaborator name')
      return
    }

    if (!newCollaborator.walletAddress.trim()) {
      toast.error('Please enter wallet address')
      return
    }

    // Basic wallet address validation (should start with 0x and be 42 characters)
    if (!newCollaborator.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Please enter a valid wallet address')
      return
    }

    if (newCollaborator.percentage <= 0 || newCollaborator.percentage > remainingPercentage) {
      toast.error(`Percentage must be between 1 and ${remainingPercentage}`)
      return
    }

    // Check for duplicate wallet address
    if (collaborators.some(c => c.walletAddress.toLowerCase() === newCollaborator.walletAddress.toLowerCase())) {
      toast.error('This wallet address is already added')
      return
    }

    const collaborator: Collaborator = {
      id: Date.now().toString(),
      name: newCollaborator.name.trim(),
      walletAddress: newCollaborator.walletAddress.trim(),
      percentage: newCollaborator.percentage,
      role: newCollaborator.role.trim() || 'Collaborator'
    }

    onCollaboratorsChange([...collaborators, collaborator])
    
    // Reset form
    setNewCollaborator({
      name: '',
      walletAddress: '',
      percentage: 0,
      role: ''
    })
    setIsAddingCollaborator(false)
    
    toast.success(`${collaborator.name} added as collaborator`)
  }

  const handleRemoveCollaborator = (id: string) => {
    const collaborator = collaborators.find(c => c.id === id)
    onCollaboratorsChange(collaborators.filter(c => c.id !== id))
    
    if (collaborator) {
      toast.success(`${collaborator.name} removed from collaborators`)
    }
  }

  const handlePercentageChange = (id: string, newPercentage: number) => {
    if (newPercentage < 0 || newPercentage > 100) return
    
    const otherCollaboratorsTotal = collaborators
      .filter(c => c.id !== id)
      .reduce((sum, c) => sum + c.percentage, 0)
    
    if (otherCollaboratorsTotal + newPercentage > 100) {
      toast.error('Total percentage cannot exceed 100%')
      return
    }

    onCollaboratorsChange(
      collaborators.map(c => 
        c.id === id ? { ...c, percentage: newPercentage } : c
      )
    )
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span>Collaborator Revenue Splits</span>
          {collaborators.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Split Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Revenue Split Overview</span>
            <div className="flex items-center gap-2">
              {isValidSplit ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className={`font-semibold ${isValidSplit ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Allocated:</span>
              <span className="font-medium">{totalPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available:</span>
              <span className="font-medium text-green-600">{remainingPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Share:</span>
              <span className="font-medium text-purple-600">{remainingPercentage}%</span>
            </div>
          </div>
          
          {/* Visual percentage bar */}
          <div className="mt-3">
            <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {collaborators.map((collaborator, index) => (
                <div
                  key={collaborator.id}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${collaborator.percentage}%` }}
                  title={`${collaborator.name}: ${collaborator.percentage}%`}
                />
              ))}
              {remainingPercentage > 0 && (
                <div
                  className="bg-gradient-to-r from-blue-400 to-cyan-400"
                  style={{ width: `${remainingPercentage}%` }}
                  title={`Your share: ${remainingPercentage}%`}
                />
              )}
            </div>
          </div>
          
          {!isValidSplit && (
            <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Total percentage exceeds 100%. Please adjust the splits.</span>
            </div>
          )}
        </div>

        {/* Existing Collaborators */}
        {collaborators.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Current Collaborators
            </h4>
            
            <AnimatePresence>
              {collaborators.map((collaborator, index) => (
                <motion.div
                  key={collaborator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="w-4 h-4 text-purple-500" />
                            <h5 className="font-semibold truncate">{collaborator.name}</h5>
                            {collaborator.role && (
                              <Badge variant="outline" className="text-xs">
                                {collaborator.role}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 font-mono truncate">
                            {collaborator.walletAddress}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <Percent className="w-3 h-3 text-green-500" />
                            <span className="text-sm font-medium">
                              {collaborator.percentage}% revenue share
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          {/* Percentage Input */}
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="1"
                              max={collaborator.percentage + remainingPercentage}
                              value={collaborator.percentage}
                              onChange={(e) => handlePercentageChange(collaborator.id, Number(e.target.value))}
                              className="w-16 h-8 text-xs"
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add New Collaborator */}
        {!isAddingCollaborator ? (
          <Button
            onClick={() => setIsAddingCollaborator(true)}
            variant="outline"
            className="w-full h-12 border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20"
            disabled={remainingPercentage <= 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            {remainingPercentage > 0 
              ? `Add Collaborator (${remainingPercentage}% available)`
              : 'No percentage remaining'
            }
          </Button>
        ) : (
          <Card className="border-2 border-purple-300 dark:border-purple-700">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Add New Collaborator</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingCollaborator(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collab-name">Name *</Label>
                  <Input
                    id="collab-name"
                    placeholder="Artist name"
                    value={newCollaborator.name}
                    onChange={(e) => setNewCollaborator(prev => ({ ...prev, name: e.target.value }))}
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="collab-role">Role (Optional)</Label>
                  <Input
                    id="collab-role"
                    placeholder="Producer, Vocalist, etc."
                    value={newCollaborator.role}
                    onChange={(e) => setNewCollaborator(prev => ({ ...prev, role: e.target.value }))}
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="collab-wallet">Wallet Address *</Label>
                <Input
                  id="collab-wallet"
                  placeholder="0x..."
                  value={newCollaborator.walletAddress}
                  onChange={(e) => setNewCollaborator(prev => ({ ...prev, walletAddress: e.target.value }))}
                  className="font-mono text-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collab-percentage">Revenue Share % *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="collab-percentage"
                      type="number"
                      min="1"
                      max={remainingPercentage}
                      value={newCollaborator.percentage || ''}
                      onChange={(e) => setNewCollaborator(prev => ({ 
                        ...prev, 
                        percentage: Math.min(Number(e.target.value), remainingPercentage)
                      }))}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max: {remainingPercentage}%
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Preview Split</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Collaborator:</span>
                      <span className="font-medium">{newCollaborator.percentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Your share:</span>
                      <span className="font-medium">{remainingPercentage - newCollaborator.percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleAddCollaborator}
                  disabled={!newCollaborator.name || !newCollaborator.walletAddress || newCollaborator.percentage <= 0}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collaborator
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingCollaborator(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Revenue Split Information</p>
              <ul className="text-amber-700 dark:text-amber-300 space-y-1 text-xs">
                <li>• Revenue splits are automatically distributed when NFTs are sold</li>
                <li>• Collaborators receive their percentage of all sales and royalties</li>
                <li>• Splits cannot be changed after the track is deployed</li>
                <li>• Ensure all wallet addresses are correct before proceeding</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}