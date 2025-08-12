import { ApiItemResponse, ApiListResponse, PaymentPayload, PaymentResponse, Product } from './types'

// Lightweight in-memory mock for local dev or demos
const mockProducts: Product[] = Array.from({ length: 10 }).map((_, i) => ({
  id: String(i + 1),
  name: `Demo Product ${i + 1}`,
  description: `A short description for product ${i + 1}.` ,
  image: `https://picsum.photos/seed/prod${i + 1}/720/480`,
  price: 19.99 + i,
  variations: [
    { id: 'basic', label: 'Basic' },
    { id: 'plus', label: 'Plus', priceDelta: 5 },
    { id: 'pro', label: 'Pro', priceDelta: 10 },
  ]
}))

export async function mockApi<T>(path: string, init?: RequestInit): Promise<T> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 650))

  if (path === '/products' && (!init || init.method === 'GET')) {
    return { data: mockProducts } as ApiListResponse<Product> as T
  }
  if (path?.startsWith('/products/') && (!init || init.method === 'GET')) {
    const id = path.split('/').pop()!
    const found = mockProducts.find(p => p.id === id)
    if (!found) throw new Error('Product not found')
    return { data: found } as ApiItemResponse<Product> as T
  }
  if (path === '/payments' && init?.method === 'POST') {
    const payload = JSON.parse(String(init.body || '{}')) as PaymentPayload
    // Randomize success/failure for demo
    const ok = Math.random() > 0.15
    const response: PaymentResponse = ok
      ? { status: 'success', orderId: `${payload.productId}-${Date.now()}` }
      : { status: 'failure', message: 'Payment was declined. Try another method.' }
    return response as T
  }
  throw new Error('Unknown mock endpoint: ' + path)
}
