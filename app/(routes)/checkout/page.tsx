import { cookies } from 'next/headers'
import { verifySelectionToken } from '@/lib/session'
import { redirect } from 'next/navigation'
import CheckoutForm from '../CheckoutForm'


export default async function CheckoutPage() {
  console.log('Checkout page accessed') 
  
  // Get the secure cookie from the user's browser
  const cookieStore = cookies()
  const token = cookieStore.get('product_selection')?.value

  console.log('Token found:', !!token)

  // If no token, redirect to home page
  if (!token) {
    console.log('No token found, redirecting to home')
    redirect('/')
  }

  // Verify the token is valid and not tampered with
  const selection = await verifySelectionToken(token)
  
  // If token is invalid or expired, redirect to home
  if (!selection) {
    console.log('Invalid token, redirecting to home')
    redirect('/')
  }

  console.log('Valid selection found:', selection)

  // Pass the verified data to our form component
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutForm 
        voucherCode={selection.voucherCode}
        denominationCode={selection.denominationCode}
        productData={selection.productData}
      />
    </div>
  )
}