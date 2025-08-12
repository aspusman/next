import { ApiItemResponse, ApiListResponse, PaymentPayload, PaymentResponse, Product } from './types'
import { envFlag } from './utils'
import { mockApi } from './mock'

// Centralized fetch wrapper with strict error handling and timeouts
async function safeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const useMock = envFlag(process.env.NEXT_PUBLIC_USE_MOCK)

  // When mocking, defer to the in-memory mock implementation
  if (useMock) return mockApi<T>(path, init)

  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) throw new Error('API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL or enable mock mode.')

  const controller = new AbortController()
  //const timeout = setTimeout(() => controller.abort(), 12000) // 12s safety timeout

  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      },
      signal: controller.signal,
      cache: 'no-store'
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`API ${res.status}: ${text || res.statusText}`)
    }
    return res.json()
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('The request took too long and was aborted. Please try again.')
    throw new Error(err?.message || 'Something went wrong. Please try again.')
  } finally {
    //clearTimeout(timeout)
  }
} 
// usman waheed here 


// Public API helpers — all wrapped with try/catch at call sites
export const api = {
  listProducts: (payload: any) => safeFetch<ApiListResponse<Product>>('/vouchers/get/list', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_MVP_API_AUTH || '', // from .env.local
    },
    body: JSON.stringify(payload)
  }),


 getProduct: (payload:any) => safeFetch<any>('/vouchers/get/detail', {
  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_MVP_API_AUTH || '', // from .env.local
    },
     body: JSON.stringify(payload)
  }),



  payJazzCash: (payloadForJazzCash:any) => safeFetch<any>('/jc/checkout', {
    
   method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_MVP_API_AUTH || '', // from .env.local
    },
     body: JSON.stringify(payloadForJazzCash)
  }),






  // getProduct: (id: string) => safeFetch<ApiItemResponse<Product>>('vouchers/get/detail'),
  pay: (payload: PaymentPayload) => safeFetch<PaymentResponse>('/payments', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
