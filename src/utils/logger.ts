/**
 * Simple logger interface to allow host applications to plug in their own logging implementation.
 */
export interface X402Logger {
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}

/**
 * Default console-based logger implementation.
 */
export const defaultLogger: X402Logger = {
  info: (message, meta) => console.info('[x402-core]', message, meta ?? ''),
  warn: (message, meta) => console.warn('[x402-core]', message, meta ?? ''),
  error: (message, meta) => console.error('[x402-core]', message, meta ?? ''),
};
