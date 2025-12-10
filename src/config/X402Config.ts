export interface X402Config {
  /**
   * Base URL of the x402 facilitator service.
   */
  facilitatorUrl: string;

  /**
   * Optional API key or token used to authenticate against the facilitator.
   */
  apiKey?: string;

  /**
   * Default network identifier (e.g. "base-mainnet", "base-sepolia").
   */
  defaultNetwork: string;

  /**
   * Default asset symbol (e.g. "USDC").
   */
  defaultAsset: string;

  /**
   * Seller wallet address that will receive the payments.
   */
  sellerWallet: string;

  /**
   * Fallback mode. Phase 0 only supports strict deny.
   */
  fallbackMode: 'deny';

  /**
   * Optional tenant resolver which can derive a tenant id from a request.
   * The request is intentionally typed as unknown to keep this package framework-agnostic.
   */
  tenantResolver?: (req: unknown) => string | null;

  /**
   * Optional logger implementation. If omitted, a default console-based logger will be used.
   */
  logger?: import('../utils/logger').X402Logger;
}
