import { MarketplacePage } from '@/src/components/pageComponents/marketplace'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marketplace/')({
  component: MarketplacePage,
})
