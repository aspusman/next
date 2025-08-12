import crypto from 'crypto'

export function createSignature({
  serviceId,
  voucherCode,
  merchantPrivateKey,
  merchantPublicKey,
}: {
  
  serviceId: string
  voucherCode: string
  merchantPrivateKey: string
  merchantPublicKey: string
}) {
  // Step 1: concatenate values exactly like in PHP
  const message = `${serviceId}${voucherCode}`

  // Step 2: create HMAC with SHA-256 using merchantPrivateKey
  const hmacHex = crypto
    .createHmac('sha256', merchantPrivateKey)
    .update(message, 'utf8')
    .digest('hex') // same as PHP hash_hmac hex output

  // Step 3: build final signature
  return `${merchantPublicKey}:${hmacHex}`
}