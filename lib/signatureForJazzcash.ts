import crypto from 'crypto'

export function createSignature({
  amount,
  cnic,
  msisdn,
  orderId,
  serviceId,
  merchantPrivateKey,
  merchantPublicKey,
}: {
  
  amount: string
  cnic: string
  msisdn: string
  orderId: string
  serviceId: string
  merchantPrivateKey: string
  merchantPublicKey: string
}) {

  
  // Step 1: concatenate values exactly like in 
  const message = `${amount}${cnic}${msisdn}${orderId}${serviceId}`
  if (!merchantPrivateKey || !merchantPublicKey) {
  throw new Error('Missing merchant keys')
}

  // Step 2: create HMAC with SHA-256 using merchantPrivateKey
  const hmacHex = crypto.createHmac('sha256', merchantPrivateKey)
    .update(message, 'utf8')
    .digest('hex') // same as PHP hash_hmac hex output

  // Step 3: build final signature
  return `${merchantPublicKey}:${hmacHex}`
}