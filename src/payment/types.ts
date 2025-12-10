import type { X402Config } from '../config/X402Config';

/**
 * High-level parameters describing a payment requirement for a resource.
 */
export interface PaymentParams {
  price: string;
  asset?: string;
  network?: string;
  description?: string;
}

/**
 * Canonical representation of an x402 payment requirement that can be sent
 * to a client as part of an HTTP 402 response.
 */
export interface PaymentRequirement {
  amount: string;
  asset: string;
  network: string;
  seller: string;
  facilitator: string;
  expiresAt: string;
  nonce: string;
  description?: string;
}

/**
 * Raw payment credential as received from an HTTP request.
 * The exact structure depends on the facilitator and client implementation.
 */
export interface PaymentCredential {
  raw: unknown;
}

/**
 * Result of verifying a payment against a requirement.
 */
export type PaymentVerificationStatus =
  | 'success'
  | 'insufficient'
  | 'invalid'
  | 'expired'
  | 'network_error';

export interface PaymentVerificationResult {
  status: PaymentVerificationStatus;
  txHash?: string;
  walletAddress?: string;
  /**
   * Optional machine readable error code for non-success statuses.
   */
  errorCode?: string;
  /**
   * Optional human readable message for diagnostic purposes.
   */
  message?: string;
}

/**
 * Minimal shape of the core service configuration.
 * This alias is here so that other modules can import a single type file if needed.
 */
export type CoreConfig = X402Config;
