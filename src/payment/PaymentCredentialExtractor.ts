import type { PaymentCredential } from './types';

/**
 * Extracts a payment credential from a generic HTTP request object.
 *
 * The request type is intentionally unknown to avoid coupling this package
 * to any specific web framework. Adapters (NestJS, Next.js, etc.) are expected
 * to pass their native request objects here.
 */
export class PaymentCredentialExtractor {
  /**
   * Attempt to extract a PaymentCredential from the given request.
   * Phase 0 skeleton: by default this always returns null.
   *
   * Framework adapters are expected to wrap or extend this class and implement
   * a concrete extraction strategy based on headers, body or query parameters.
   */
  extract(_req: unknown): PaymentCredential | null {
    // TODO: implement concrete extraction in a later phase or via adapter.
    return null;
  }
}
