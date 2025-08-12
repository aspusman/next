'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Loader } from '@/components/ui/Loader'
import { createSignature } from '@/lib/signatureForJazzcash'

// Form validation schema
const Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required').regex(/^\d+$/, 'Phone must be numeric'),
  email: z.string().min(1, 'Email is required').email('Invalid email')
})

type FormValues = z.infer<typeof Schema>

// Props interface for the component
interface CheckoutFormProps {
  voucherCode: string
  denominationCode: string
  productData: {
    productName: string
    productImage: string
    variationAmount: string
    serviceId: string
  }
}

export default function CheckoutForm({ 
  voucherCode, 
  denominationCode, 
  productData 
}: CheckoutFormProps) {
  const router = useRouter()
  
  console.log('CheckoutForm received:', { voucherCode, denominationCode, productData })
  
  // Form setup
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(Schema)
  })

  // Create JazzCash payment data (your existing logic)
  const amount = productData.variationAmount || '1'
  const cnic = '00000000000'
  const msisdn = '03025092178'
  const orderId = crypto.randomUUID() + denominationCode
  const serviceId = productData.serviceId || '774000'
  const merchantPrivateKey = '3e64c311-8313-4c2c-8db0-1bc57213e87f'
  const merchantPublicKey = '84bbe1a7-6e0a-4638-ab45-be815987dc1f'

  // Create signature (your existing logic)
  const sig = createSignature({
    amount,
    cnic,
    msisdn,
    orderId,
    serviceId,
    merchantPrivateKey,
    merchantPublicKey,
  })

  const payloadForJazzCash = {
    amount,
    cnic,
    msisdn,
    orderId,
    serviceId,
    signature: sig
  }

  console.log('JazzCash payload:', payloadForJazzCash)

  // Payment mutation (your existing logic)
  const mutation = useMutation({
    mutationFn: (values: FormValues) => api.payJazzCash(payloadForJazzCash),
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        router.push(`/success?orderId=${orderId}`)
      } else {
        alert(res.message || 'Payment failed.')
      }
    },
    onError: (err: any) => {
      console.error('Payment error:', err)
      alert(err.message || 'Payment failed. Please try again.')
    },
  })

  const onSubmit = (values: FormValues) => {
    console.log('Form submitted with:', values)
    mutation.mutate(values)
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Product Summary - NEW: Shows what user is buying */}
      <div className="mb-6 rounded-lg border bg-gray-50 p-4">
        <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
        <div className="flex items-center gap-4">
          {productData.productImage && (
            <img 
              src={productData.productImage} 
              alt={productData.productName}
              className="h-16 w-16 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <p className="font-medium">{productData.productName}</p>
            <p className="text-sm text-gray-600">
              Voucher: {voucherCode}
            </p>
            <p className="text-sm text-gray-600">
              Variation: {denominationCode}
            </p>
            <p className="text-lg font-semibold text-green-600">
              Amount: {productData.variationAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Input 
            label="First Name" 
            placeholder="John" 
            {...register('firstName')} 
            error={errors.firstName?.message} 
          />
          <Input 
            label="Last Name" 
            placeholder="Doe" 
            {...register('lastName')} 
            error={errors.lastName?.message} 
          />
        </div>
        
        <Input 
          label="Phone" 
          placeholder="03331234567" 
          inputMode="numeric" 
          {...register('phone')} 
          error={errors.phone?.message} 
        />
        
        <Input 
          label="Email" 
          placeholder="you@example.com" 
          type="email" 
          {...register('email')} 
          error={errors.email?.message} 
        />

        <Button 
          disabled={!isValid || mutation.isPending} 
          type="submit" 
          className="w-full"
        >
          {mutation.isPending ? 'Processing Payment...' : `Pay ${productData.variationAmount}`}
        </Button>
        
        {mutation.isPending && <Loader />}
      </form>
    </div>
  )
}