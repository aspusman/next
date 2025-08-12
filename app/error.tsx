'use client'
import { useEffect } from 'react'
import { ErrorState } from '@/components/ui/ErrorState'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return <ErrorState message={error.message} onRetry={reset} />
}
