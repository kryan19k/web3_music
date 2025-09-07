import { Navbar } from '@/src/components/layout/Navbar'
import { MiniPlayer } from '@/src/components/music/MiniPlayer'
import { TanStackReactQueryDevtools } from '@/src/components/sharedComponents/dev/TanStackReactQueryDevtools'
import { TanStackRouterDevtools } from '@/src/components/sharedComponents/dev/TanStackRouterDevtools'
import { Provider } from '@/src/components/ui/provider'
import { Toaster } from '@/src/components/ui/toaster'
import { ThemeProvider } from '@/src/contexts/ThemeContext'
import { TransactionNotificationProvider } from '@/src/providers/TransactionNotificationProvider'
import { Web3Provider } from '@/src/providers/Web3Provider'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  return (
    <div dir="ltr">
      <ThemeProvider>
        <Provider>
          <Web3Provider>
            <TransactionNotificationProvider>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <main className="flex-1 pt-16 pb-24">
                  <Outlet />
                </main>
                <MiniPlayer />
                <TanStackReactQueryDevtools />
                <TanStackRouterDevtools />
              </div>
              <Toaster />
            </TransactionNotificationProvider>
          </Web3Provider>
          <Analytics />
        </Provider>
      </ThemeProvider>
    </div>
  )
}
