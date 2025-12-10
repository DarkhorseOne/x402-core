import type { PaymentCredential } from './types';

/**
 * Extracts a payment credential from a generic HTTP request object.
 *
 * The request type is intentionally unknown to avoid coupling this package
 * to any specific web framework. Adapters (NestJS, Next.js, etc.) are expected
 * to pass their native request objects here.
 */
export class PaymentCredentialExtractor {
  /**
   * Attempt to extract a PaymentCredential from the given request.
   * Supports headers (`x402-payment`), JSON body (`payment`), or query (`payment`).
  */
  extract(req: unknown): PaymentCredential | null {
    if (!req || typeof req !== 'object') return null;
    const request = req as Record<string, unknown>;

    const headerValue = this.extractFromHeaders(request);
    if (headerValue) {
      return { raw: headerValue, source: 'header' };
    }

    const bodyValue = this.extractFromBody(request);
    if (bodyValue) {
      return { raw: bodyValue, source: 'body' };
    }

    const queryValue = this.extractFromQuery(request);
    if (queryValue) {
      return { raw: queryValue, source: 'query' };
    }

    return null;
  }

  private extractFromHeaders(req: Record<string, unknown>): string | null {
    const headers = (req as { headers?: unknown }).headers;
    if (!headers) return null;

    const get = (key: string): string | undefined => {
      // Support common header shapes: plain object, Headers, Map-like
      if (typeof (headers as any).get === 'function') {
        const headerCase = (value: string) =>
          value
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join('-');

        const candidates = [key, key.toLowerCase(), key.toUpperCase(), headerCase(key)];
        for (const candidate of candidates) {
          const value = (headers as any).get(candidate);
          if (typeof value === 'string') return value;
        }
        return undefined;
      }

      if (headers && typeof headers === 'object') {
        const lowerKey = key.toLowerCase();
        const entries = Object.entries(headers as Record<string, unknown>);
        for (const [k, v] of entries) {
          if (k.toLowerCase() === lowerKey && typeof v === 'string') {
            return v;
          }
        }
      }

      return undefined;
    };

    const header = get('x402-payment') ?? get('x402');
    return typeof header === 'string' && header.trim() ? header.trim() : null;
  }

  private extractFromBody(req: Record<string, unknown>): unknown {
    const body = (req as { body?: unknown }).body ?? req;
    if (!body || typeof body !== 'object') return null;
    const value = (body as Record<string, unknown>).payment;
    return value ?? null;
  }

  private extractFromQuery(req: Record<string, unknown>): unknown {
    const query = (req as { query?: unknown }).query;
    if (!query || typeof query !== 'object') return null;
    const value = (query as Record<string, unknown>).payment;
    return value ?? null;
  }
}
