import type { PaymentRequirement, PaymentCredential, PaymentVerificationResult } from './types';
import type { X402FacilitatorClient } from '../facilitator/X402FacilitatorClient';

/**
 * Abstraction for verifying x402 payments.
 */
export interface PaymentVerifier {
  verify(
    credential: PaymentCredential,
    requirement: PaymentRequirement
  ): Promise<PaymentVerificationResult>;
}

/**
 * Default implementation of PaymentVerifier that delegates to a facilitator client.
 * This is a skeleton and does not contain real business logic yet.
 */
export class DefaultPaymentVerifier implements PaymentVerifier {
  constructor(private readonly facilitatorClient: X402FacilitatorClient) {}

  async verify(
    credential: PaymentCredential,
    requirement: PaymentRequirement
  ): Promise<PaymentVerificationResult> {
    // TODO: delegate to facilitatorClient.verifyPayment() in a real implementation.
    return this.facilitatorClient.verifyPayment(credential, requirement);
  }
}
