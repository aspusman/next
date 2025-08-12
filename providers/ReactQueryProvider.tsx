'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

/**
 * React Query provider with a client per session for caching & retries.
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 2, staleTime: 30_000, refetchOnWindowFocus: false },
      mutations: { retry: 1 },
    },
  }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
