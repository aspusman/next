'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function SuccessPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const orderId = sp.get('orderId')
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
      <p className="text-sm text-gray-700">Your order <span className="font-mono">{orderId}</span> has been placed.</p>
      <div className="flex justify-center gap-2">
        <Button onClick={() => router.push('/')}>Continue Shopping</Button>
      </div>
    </div>
  )
}
