import type { PaymentCredential, PaymentRequirement, PaymentVerificationResult } from '../payment/types';
import type { X402Config } from '../config/X402Config';
import { validateConfig } from '../config/validateConfig';
import { PaymentNetworkError } from '../errors';

/**
 * Minimal abstraction for an x402 facilitator client.
 */
export interface X402FacilitatorClient {
  /**
   * Verify a payment credential against a requirement.
   */
  verifyPayment(
    credential: PaymentCredential,
    requirement: PaymentRequirement
  ): Promise<PaymentVerificationResult>;

  /**
   * Optionally allow the facilitator client to build a requirement directly.
   * This is useful if the facilitator exposes a canonical representation.
   */
  createRequirement?(params: unknown): PaymentRequirement;
}

/**
 * Skeleton HTTP-based facilitator client implementation.
 *
 * In Phase 0 this acts as a placeholder and does not perform real HTTP calls.
 * A future implementation should use fetch/undici/axios and handle authentication,
 * error mapping, and timeouts according to the x402 specification.
 */
export class HttpFacilitatorAdapter implements X402FacilitatorClient {
  private readonly config: X402Config;
  private readonly fetchImpl: typeof fetch;

  constructor(config: X402Config, fetchImpl: typeof fetch = globalThis.fetch) {
    this.config = validateConfig(config);
    this.fetchImpl = fetchImpl;
    if (!this.fetchImpl) {
      throw new PaymentNetworkError('Fetch implementation is required for HttpFacilitatorAdapter');
    }
  }

  async verifyPayment(
    credential: PaymentCredential,
    requirement: PaymentRequirement
  ): Promise<PaymentVerificationResult> {
    try {
      const url = this.joinUrl(this.config.facilitatorUrl, '/verify');
      const response = await this.fetchImpl(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          credential: credential?.raw ?? credential,
          requirement,
        }),
      });

      if (!response.ok) {
        throw new PaymentNetworkError(`Facilitator responded with status ${response.status}`);
      }

      const data = (await response.json()) as PaymentVerificationResult;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown facilitator error';
      throw new PaymentNetworkError(message);
    }
  }

  private joinUrl(base: string, path: string): string {
    if (base.endsWith('/')) {
      return `${base.slice(0, -1)}${path}`;
    }
    return `${base}${path}`;
  }
}
