import { AdminContainer } from '@/src/components/admin/AdminContainer'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin')({
  component: AdminContainer,
})
