import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';

export function base64Encode(payload: any): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function signRequest(payload: string, endpoint: string, saltKey: string, saltIndex: string): string {
  const stringToSign = payload + endpoint + saltKey;
  const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
  return `${sha256}###${saltIndex}`;
}

export function verifySignature(payload: string, xVerify: string, saltKey: string, saltIndex: string): boolean {
  // xVerify format: SHA256(payload + saltKey) + ### + saltIndex
  // Note: For webhooks, the payload is the raw JSON body, not base64 encoded (usually).
  // But PhonePe documentation says checksum is SHA256(base64Payload + apiEndpoint + saltKey) + ### + saltIndex for requests.
  // For callbacks, it's SHA256(responsePayload + saltKey) + ### + saltIndex?
  // Let's check docs strictly.
  // Webhook: X-VERIFY header is SHA256(base64EncodedBody + saltKey) + ### + saltIndex.

  // However, receiving the webhook, we get a specific JSON.
  // We need to verify if xVerify matches what we compute.

  const calculatedChecksum = `${crypto.createHash('sha256').update(payload + saltKey).digest('hex')}###${saltIndex}`;
  return calculatedChecksum === xVerify;
}
