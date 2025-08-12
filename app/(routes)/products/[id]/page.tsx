'use client'
import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { VariationSelector } from '@/components/VariationSelector'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/ErrorState'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const voucherCode = id;
  const serviceId = '774000'
  const router = useRouter()
  
  // State for selected variation and loading
  const [selected, setSelected] = React.useState<string | undefined>()
  const [isCreatingSelection, setIsCreatingSelection] = React.useState(false)

  // Get signature (your existing code)
  const signatureQuery = useQuery({
    queryKey: ['signature', serviceId, voucherCode],
    queryFn: async () => {
      const res = await fetch('/api/vouchers/create-signature', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: process.env.NEXT_PUBLIC_MVP_API_AUTH || '' 
        },
        body: JSON.stringify({
          voucherCode: voucherCode,
          serviceId: serviceId,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json() as Promise<{ signature: string }>
    },
  })

  // Build payload (your existing code)
  const payload = React.useMemo(() => {
    if (!signatureQuery.data?.signature) return null
    return {
      serviceId: serviceId,
      voucherCode: voucherCode,
      signature: signatureQuery.data.signature,
    }
  }, [signatureQuery.data?.signature, serviceId, voucherCode])

  // Fetch product detail (your existing code)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/vouchers/get/detail', payload],
    queryFn: () => api.getProduct(payload!),
    enabled: Boolean(payload),
  })

  type Variation = {
    denominationCode: string
    denominationAmount: string
  }

  const product = data?.denominations

  // NEW: Secure Pay Now function
  const handlePayNow = async () => {
    // Check if user selected a variation
    if (!selected || !product) {
      alert('Please select a variation first')
      return
    }

    // Show loading state
    setIsCreatingSelection(true)
    
    try {
      // Find the selected variation details
      const selectedVariation = product.find((v: Variation) => v.denominationCode === selected)
      
      if (!selectedVariation) {
        alert('Selected variation not found')
        return
      }

      console.log("dear selected variation isssssssssss ", selectedVariation);

      // Call our secure API to create the selection
      const response = await fetch('/api/create-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherCode: voucherCode,
          denominationCode: selected,
          productData: {
            // Store all the data we need for checkout
            productName: data.name || 'Unknown Product',
            productImage: data.image || '',
            variationAmount: selectedVariation.denominationAmount,
            serviceId: serviceId,
            voucherCode: voucherCode
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create selection')
      }

      const result = await response.json()
      console.log('Selection created hooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo:', result)

      // Navigate to checkout page (no sensitive data in URL!)
      router.push('/checkout')
      
    } catch (error) {
      console.error('Error creating selection:', error)
      alert('Failed to proceed to checkout. Please try again.')
    } finally {
      setIsCreatingSelection(false)
    }
  }

  // Loading and error states (your existing code)
  if (isLoading) return <Loader />
  if (isError) return <ErrorState message={(error as Error).message} onRetry={() => location.reload()} />
  if (!product) return <ErrorState message="Product not found." />

  const selectedVar = product?.find((v: Variation) => v.denominationCode === selected)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border">
        <Image src={data?.image || '/placeholder.jpg'} alt={data?.name || 'Product'} fill className="object-cover" />
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{data?.name || 'Product Name'}</h1>
        <p className="text-sm text-gray-700">{data?.description || 'Product description'}</p>
        
        <div className="pt-2">
          <h2 className="mb-2 text-sm font-semibold">Choose a variation</h2>
          <VariationSelector 
            variations={product} 
            selected={selected} 
            onSelect={setSelected} 
          />
        </div>
        
        {selectedVar && (
          <p className="text-lg font-semibold">
            Amount: {selectedVar.denominationAmount}
          </p>
        )}
        
        {/* UPDATED: Secure Pay Now Button */}
        <Button
          disabled={!selected || isCreatingSelection}
          onClick={handlePayNow} // Uses our new secure function
          className="w-full md:w-auto"
        >
          {isCreatingSelection ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </div>
  )
}