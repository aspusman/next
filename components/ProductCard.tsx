'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from './ui/Button'

/**
 * Card showing product image, name, price, and a View Details button.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image src={product.iconURL} alt={product.voucherName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="line-clamp-1 text-base font-semibold">{product.voucherName}</h3>
         {/* <p className="text-sm text-gray-600">{formatCurrency(product)}</p> */}
        <Link href={`/products/${product.voucherCode}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </div>
    </motion.article>
  )
}

