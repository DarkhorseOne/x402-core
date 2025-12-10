import { describe, expect, it } from 'vitest';
import { DefaultPaymentVerifier } from '../src/payment/PaymentVerifier';
import type { PaymentRequirement, PaymentVerificationResult } from '../src/payment/types';
import {
  PaymentExpiredError,
  PaymentInvalidError,
  PaymentNetworkError,
  PaymentRequiredError,
} from '../src/errors';

const requirement: PaymentRequirement = {
  amount: '1',
  asset: 'USDC',
  network: 'base-mainnet',
  seller: '0xabc',
  facilitator: 'https://facilitator.example.com',
  expiresAt: new Date(Date.now() + 60_000).toISOString(),
  nonce: '123',
};

const credential = { raw: 'token' };

describe('DefaultPaymentVerifier', () => {
  it('returns success result', async () => {
    const verifier = new DefaultPaymentVerifier({
      verifyPayment: async () =>
        ({
          status: 'success',
          txHash: '0xhash',
        }) as PaymentVerificationResult,
    });

    const result = await verifier.verify(credential, requirement);
    expect(result.status).toBe('success');
    expect(result.txHash).toBe('0xhash');
  });

  it('throws PaymentInvalidError on invalid/insufficient', async () => {
    const verifier = new DefaultPaymentVerifier({
      verifyPayment: async () => ({ status: 'invalid', message: 'bad' }),
    });

    await expect(verifier.verify(credential, requirement)).rejects.toBeInstanceOf(PaymentInvalidError);
  });

  it('throws PaymentExpiredError on expired', async () => {
    const verifier = new DefaultPaymentVerifier({
      verifyPayment: async () => ({ status: 'expired' }),
    });

    await expect(verifier.verify(credential, requirement)).rejects.toBeInstanceOf(PaymentExpiredError);
  });

  it('throws PaymentNetworkError on network error', async () => {
    const verifier = new DefaultPaymentVerifier({
      verifyPayment: async () => ({ status: 'network_error' }),
    });

    await expect(verifier.verify(credential, requirement)).rejects.toBeInstanceOf(PaymentNetworkError);
  });

  it('throws PaymentRequiredError when credential is missing', async () => {
    const verifier = new DefaultPaymentVerifier({
      verifyPayment: async () => ({ status: 'success' }),
    });

    // @ts-expect-error intentional for runtime behavior
    await expect(verifier.verify(null, requirement)).rejects.toBeInstanceOf(PaymentRequiredError);
  });

  it('wraps unexpected errors as PaymentNetworkError', async () => {
    const verifier = new DefaultPaymentVerifier({
      verifyPayment: async () => {
        throw new Error('boom');
      },
    });

    await expect(verifier.verify(credential, requirement)).rejects.toBeInstanceOf(PaymentNetworkError);
  });
});
