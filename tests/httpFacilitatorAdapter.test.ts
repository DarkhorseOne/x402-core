import { describe, expect, it, vi } from 'vitest';
import { HttpFacilitatorAdapter } from '../src/facilitator/X402FacilitatorClient';
import { PaymentRequirementBuilder } from '../src/payment/PaymentRequirementBuilder';
import type { X402Config } from '../src/config/X402Config';
import { PaymentNetworkError } from '../src/errors';

const config: X402Config = {
  facilitatorUrl: 'https://facilitator.example.com',
  defaultNetwork: 'base-mainnet',
  defaultAsset: 'USDC',
  sellerWallet: '0xabc',
  fallbackMode: 'deny',
  apiKey: 'test-key',
};

const builder = new PaymentRequirementBuilder(config);
const requirement = builder.build({ price: '1' });

describe('HttpFacilitatorAdapter', () => {
  it('posts credential and requirement to facilitator', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', txHash: '0xhash' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const adapter = new HttpFacilitatorAdapter(config, fetchMock as unknown as typeof fetch);
    const result = await adapter.verifyPayment({ raw: 'credential-token' }, requirement);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://facilitator.example.com/verify');
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>)['Authorization']).toBe('Bearer test-key');
    expect(result.status).toBe('success');
    expect(result.txHash).toBe('0xhash');
  });

  it('throws PaymentNetworkError on fetch failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    const adapter = new HttpFacilitatorAdapter(config, fetchMock as unknown as typeof fetch);

    await expect(adapter.verifyPayment({ raw: 'credential' }, requirement)).rejects.toBeInstanceOf(
      PaymentNetworkError
    );
  });
});
