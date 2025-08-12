import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // 1) Read the body the client sent us
    const body = await req.json() as { serviceId: string; signature: string }

    // 2) Call the external API from the server (secret stays on server)
    const res = await fetch(`${process.env.MVP_API_BASE}/vouchers/get/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Use your server-only secret:
        'Authorization': process.env.MVP_API_AUTH || '',
        // Do NOT forward browser cookies unless you know you need them:
        // 'Cookie': 'AWSALBTG=...; AWSALBTGCORS=...'
      },
      body: JSON.stringify(body),
      // Optional: reasonable timeout via AbortController (skipped for brevity)
      cache: 'no-store',
    })

    // 3) Normalize errors
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json({ error: text || res.statusText }, { status: res.status })
    }

    // 4) Return the external API JSON to the browser
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}