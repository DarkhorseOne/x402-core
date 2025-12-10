/**
 * Base error type for all x402-core errors.
 */
export class X402Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Thrown when payment is required but not provided or not sufficient.
 */
export class PaymentRequiredError extends X402Error {
  constructor(public readonly requirement: unknown, message = 'Payment required') {
    super(message);
  }
}

/**
 * Thrown when a payment credential is invalid for the given requirement.
 */
export class PaymentInvalidError extends X402Error {}

/**
 * Thrown when a payment has expired.
 */
export class PaymentExpiredError extends X402Error {}

/**
 * Thrown when the facilitator cannot be reached or returns a network-level error.
 */
export class PaymentNetworkError extends X402Error {}

/**
 * Thrown when X402 configuration is invalid or incomplete.
 */
export class X402ConfigError extends X402Error {}
