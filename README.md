# Next.js Products Demo

A clean, secure, beginner-friendly Next.js App Router project with product listing, details with variations, checkout with validation, and a simulated payment flow. Built with TypeScript, Tailwind, React Query, Zod, RHF, and Framer Motion.

## Features
- Product list from API with skeletons
- Product detail page with selectable variations
- Checkout form with live validation and proper error handling
- Payment simulation with loading states and success/failure handling
- Reusable UI components (Button, Input, Loader, etc.)
- Environment-based configuration + optional mock API
- Strong typing + comments explaining key blocks

## Running Locally
1. Install Node >= 18.
2. `npm install`
3. Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` **or** `NEXT_PUBLIC_USE_MOCK=true`.
4. `npx tailwindcss init -p` (if needed) then `npm run dev`
5. Open http://localhost:3000

## Deploying
- Set `NEXT_PUBLIC_API_BASE_URL` in your hosting provider (Vercel recommended).
- Disable mock mode in production by removing `NEXT_PUBLIC_USE_MOCK` or setting to `false`.

## Notes
- Replace images and API endpoints with your own.
- Extend `PaymentPayload` for real gateways.
