import { describe, expect, it } from 'vitest';
import { PaymentCredentialExtractor } from '../src/payment/PaymentCredentialExtractor';

const extractor = new PaymentCredentialExtractor();

describe('PaymentCredentialExtractor', () => {
  it('extracts from headers (object)', () => {
    const req = { headers: { 'x402-payment': 'header-token' } };
    const credential = extractor.extract(req);
    expect(credential?.raw).toBe('header-token');
    expect(credential?.source).toBe('header');
  });

  it('extracts from headers (Headers-like)', () => {
    const headers = new Map<string, string>([['X402-Payment', 'mapped-token']]);
    const req = { headers: { get: (key: string) => headers.get(key) } };
    const credential = extractor.extract(req);
    expect(credential?.raw).toBe('mapped-token');
  });

  it('extracts from body', () => {
    const credential = extractor.extract({ body: { payment: { proof: 'abc' } } });
    expect(credential?.raw).toEqual({ proof: 'abc' });
    expect(credential?.source).toBe('body');
  });

  it('extracts from query', () => {
    const credential = extractor.extract({ query: { payment: 'query-token' } });
    expect(credential?.raw).toBe('query-token');
    expect(credential?.source).toBe('query');
  });

  it('returns null when not found', () => {
    expect(extractor.extract({ headers: {} })).toBeNull();
  });
});
