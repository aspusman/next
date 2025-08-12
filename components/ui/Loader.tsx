'use client'
/** Simple spinner for loading states */
export function Loader() {
  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label="Loading">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
    </div>
  )
}
