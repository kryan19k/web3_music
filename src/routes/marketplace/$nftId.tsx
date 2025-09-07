import { NFTDetailPage } from '@/src/components/pageComponents/marketplace/NFTDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marketplace/$nftId')({
  component: NFTDetailPage,
})
