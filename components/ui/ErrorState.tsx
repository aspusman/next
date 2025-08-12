'use client'
import { Button } from './Button'

/** Displays a friendly error with retry */
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <div className="flex items-center justify-between gap-4">
        <p>{message || 'Something went wrong.'}</p>
        {onRetry && <Button variant="outline" onClick={onRetry}>Retry</Button>}
      </div>
    </div>
  )
}
