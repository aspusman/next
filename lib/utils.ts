// Helper: currency formatting
export const formatCurrency = (amount: number, currency = 'PKR') =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)

// Helper: read boolean env flags safely
export const envFlag = (v?: string) => String(v).toLowerCase() === 'true'



