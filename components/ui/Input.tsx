'use client'
import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

/**
 * Accessible input with label and inline error message.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, className, ...props }, ref) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <input ref={ref} className={clsx('w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900', className)} {...props} />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
})
