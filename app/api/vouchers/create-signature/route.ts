import { NextResponse } from 'next/server'
import { createSignature } from '@/lib/signature'

export async function POST(req: Request) {
  const {voucherCode, serviceId } = await req.json()

  const signature = createSignature({
    serviceId,
    voucherCode,
    merchantPrivateKey: process.env.MERCHANT_PRIVATE_KEY!, // from .env.local
    merchantPublicKey: process.env.MERCHANT_PUBLIC_KEY!,   // from .env.local
  })

  return NextResponse.json({ signature })
}