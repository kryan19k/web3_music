import { BlokDashboard } from '@/src/components/pageComponents/pags'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pags/')({
  component: BlokDashboard,
})
