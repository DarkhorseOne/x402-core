import type { PaymentCredential, PaymentRequirement, PaymentVerificationResult } from '../payment/types';
import type { X402Config } from '../config/X402Config';

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
  constructor(private readonly config: X402Config) {}

  async verifyPayment(
    _credential: PaymentCredential,
    requirement: PaymentRequirement
  ): Promise<PaymentVerificationResult> {
    // TODO: implement real HTTP call to facilitator.
    return {
      status: 'network_error',
      message: 'HttpFacilitatorAdapter.verifyPayment is not implemented yet',
      txHash: undefined,
      walletAddress: undefined,
      errorCode: 'NOT_IMPLEMENTED',
    };
  }
}
