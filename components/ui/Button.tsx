'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { ButtonHTMLAttributes } from 'react'

// Button variants via CVA for consistent styling
const buttonStyles = cva( 
  'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-black text-white hover:bg-gray-900 focus-visible:ring-gray-900',
        outline: 'border border-gray-300 hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        sm: 'h-9',
        md: 'h-10',
        lg: 'h-11',
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>

/**
 * Reusable Button with variants; wraps in framer-motion for subtle tap animation.
 */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} className={clsx(buttonStyles({ variant, size }), className)} {...props} />
  )
}
