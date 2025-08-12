import { NextRequest, NextResponse } from 'next/server'
import { createSelectionToken } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // Get the data from the request
    const { voucherCode, denominationCode, productData } = await request.json()
    console.log("Voucher code ",voucherCode);
    console.log("denominationCode code ",denominationCode);
    console.log("productData code ",productData);
    // Validate required data
    if (!voucherCode || !denominationCode) {
      return NextResponse.json(
        { error: 'Missing voucherCode or denominationCode' }, 
        { status: 400 }
      )
    }

    console.log('Creating selection for:', { voucherCode, denominationCode })

    // Create the secure token
    const token = await createSelectionToken(voucherCode, denominationCode, productData)
    
    // Create response and set the token as a secure cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Selection created successfully' 
    })
    
    // Set the token as an httpOnly cookie (most secure way)
    response.cookies.set('product_selection', token, {
      httpOnly: true, // Cannot be accessed by JavaScript (prevents XSS attacks)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 30 * 60, // 30 minutes
      path: '/' // Available on all pages
    })

    return response
    
  } catch (error) {
    console.error('Selection creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create selection' }, 
      { status: 500 }
    )
  }
}