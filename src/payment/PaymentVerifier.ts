import type { PaymentRequirement, PaymentCredential, PaymentVerificationResult } from './types';
import type { X402FacilitatorClient } from '../facilitator/X402FacilitatorClient';
import {
  PaymentExpiredError,
  PaymentInvalidError,
  PaymentNetworkError,
  PaymentRequiredError,
} from '../errors';

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
    if (!credential) {
      throw new PaymentRequiredError(requirement, 'Payment credential is missing');
    }

    try {
      const result = await this.facilitatorClient.verifyPayment(credential, requirement);

      switch (result.status) {
        case 'success':
          return result;
        case 'expired':
          throw new PaymentExpiredError(result.message ?? 'Payment expired');
        case 'invalid':
        case 'insufficient':
          throw new PaymentInvalidError(result.message ?? 'Payment invalid or insufficient');
        case 'network_error':
          throw new PaymentNetworkError(result.message ?? 'Facilitator network error');
        default:
          throw new PaymentRequiredError(requirement, 'Payment verification failed');
      }
    } catch (err) {
      if (
        err instanceof PaymentExpiredError ||
        err instanceof PaymentInvalidError ||
        err instanceof PaymentNetworkError ||
        err instanceof PaymentRequiredError
      ) {
        throw err;
      }

      const message = err instanceof Error ? err.message : 'Payment verification failed';
      throw new PaymentNetworkError(message);
    }
  }
}
