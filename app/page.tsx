'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProductCard } from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'

const payload = {
  serviceId: '774000',
  signature: '84bbe1a7-6e0a-4638-ab45-be815987dc1f:7651ef9e93a1307767fdee8e73c1e665467cbba9b9f9cf29f3ae7c4cf5c130f9',
}


export default function HomePage() {

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['products', payload], // include payload in key for caching
    queryFn: () => api.listProducts(payload), // pass payload here
  })

  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />

  const vouchers = Array.isArray(data) ? data : []

  // Map vouchers -> Product shape expected by ProductCard
  const products = vouchers.map(v => ({
    voucherCode: v.voucherCode,
    voucherName: v.voucherName,
    iconURL: v.iconURL || '/placeholder.png',
  }))

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">


      {products.map(p => (<ProductCard key={p.voucherCode} product={p} />))}
    </div>
  )
}
