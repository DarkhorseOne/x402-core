import type { X402Config } from '../config/X402Config';
import { validateConfig } from '../config/validateConfig';
import type { PaymentParams, PaymentRequirement } from './types';
import { randomBytes, randomUUID } from 'crypto';

/**
 * Responsible for constructing PaymentRequirement objects from simple
 * PaymentParams and global X402 configuration.
 */
export class PaymentRequirementBuilder {
  private readonly config: X402Config;
  private readonly requirementTtlMs: number;

  constructor(config: X402Config, requirementTtlMs = 5 * 60 * 1000) {
    this.config = validateConfig(config);
    this.requirementTtlMs = requirementTtlMs;
  }

  /**
   * Build a PaymentRequirement from high-level parameters.
   */
  build(params: PaymentParams): PaymentRequirement {
    if (!params || typeof params.price !== 'string' || !params.price.trim()) {
      throw new Error('PaymentParams.price is required');
    }

    const now = new Date();
    const expires = new Date(now.getTime() + this.requirementTtlMs);

    return {
      amount: params.price.trim(),
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
    if (typeof randomUUID === 'function') {
      return randomUUID();
    }

    return randomBytes(16).toString('hex');
  }
}
