import type { X402Config } from '../config/X402Config';
import type { PaymentParams, PaymentRequirement } from './types';

/**
 * Responsible for constructing PaymentRequirement objects from simple
 * PaymentParams and global X402 configuration.
 */
export class PaymentRequirementBuilder {
  constructor(private readonly config: X402Config) {}

  /**
   * Build a PaymentRequirement from high-level parameters.
   * This is a skeleton implementation; the caller should provide concrete logic
   * in a later phase.
   */
  build(params: PaymentParams): PaymentRequirement {
    const now = new Date();
    const expires = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes by default

    return {
      amount: params.price,
      asset: params.asset ?? this.config.defaultAsset,
      network: params.network ?? this.config.defaultNetwork,
      seller: this.config.sellerWallet,
      facilitator: this.config.facilitatorUrl,
      expiresAt: expires.toISOString(),
      nonce: this.generateNonce(),
      description: params.description,
    };
  }

  /**
   * Generate a nonce to be used as a unique identifier for the requirement.
   * For Phase 0 this is a very simple implementation; a production-ready
   * implementation should use a cryptographically secure random generator.
   */
  protected generateNonce(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
