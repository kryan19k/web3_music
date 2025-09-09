import { NFTPurchasePage } from '@/src/components/pageComponents/marketplace/NFTPurchase'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marketplace/purchase/$nftId')({
  component: NFTPurchasePage,
})
