import { PortfolioPage } from '@/src/components/pageComponents/portfolio'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/portfolio/')({
  component: PortfolioPage,
})
