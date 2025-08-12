'use client'
import clsx from 'clsx'
import { Variation } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

/**
 * Selectable list of variations (buttons).
 */
export function VariationSelector({
  variations,
  selected,
  onSelect,
}: {
  variations: Variation[]
  selected?: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {variations.map(v => (
        <div>
        <button
          key={v.denominationCode}
          type="button"
          onClick={() => onSelect(v.denominationCode)}
          className={clsx('rounded-xl border px-3 py-2 text-sm transition', selected === v.denominationCode ? 'border-black bg-black text-white' : 'hover:bg-gray-50')}
        >
          {v.denominationName}
        </button>
        <p>{formatCurrency(Number(v.denominationAmount))}</p>
        </div>
      ))}
      
      
    </div>
  )
}
