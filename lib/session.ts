import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

// Function to create a secure token with user's selection
export async function createSelectionToken(
  voucherCode: string, 
  denominationCode: string,
  productData: any
) {
  const token = await new SignJWT({ 
    voucherCode, 
    denominationCode,
    productData,
    createdAt: Date.now(),
    exp: Math.floor(Date.now() / 1000) + (30 * 60) // Expires in 30 minutes
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30m')
    .sign(secret)

  return token
}

// Function to verify and decode the token
export async function verifySelectionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { 
      voucherCode: string
      denominationCode: string
      productData: any
      createdAt: number
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}