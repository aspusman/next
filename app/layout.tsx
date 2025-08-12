import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'

export const metadata: Metadata = {
  title: 'Products Demo',
  description: 'Next.js App Router demo with products, checkout, and payment simulation.',
  metadataBase: new URL('https://example.com'),
  openGraph: { title: 'Products Demo', description: 'Next.js demo store', type: 'website' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <header className="border-b bg-white">
            <div className="container flex h-14 items-center justify-between">
              <a href="/" className="text-sm font-semibold">Products Demo</a>
            </div>
          </header>
          <main className="container py-6">{children}</main>
          <footer className="border-t py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Demo</footer>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
