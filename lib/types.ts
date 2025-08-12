// Basic domain models used throughout the app
export type Product = {
  voucherCode: string
  voucherName: string
  iconURL: string
}

export type Variation = {
  denominationAmount: string
  denominationCode: string
  denominationCurrency:string
  denominationName: string // optional surcharge/discount to base price
}

export type ApiListResponse<T> = { data: T[] }
export type ApiItemResponse<T> = { data: T }

export type PaymentPayload = {
  productId: string
  variationId: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

export type PaymentResponse = {
  status: 'success' | 'failure'
  orderId?: string
  message?: string
}
