import { describe, expect, it } from 'vitest';
import { PaymentRequirementBuilder } from '../src/payment/PaymentRequirementBuilder';
import type { X402Config } from '../src/config/X402Config';

const baseConfig: X402Config = {
  facilitatorUrl: 'https://facilitator.example.com',
  defaultNetwork: 'base-mainnet',
  defaultAsset: 'USDC',
  sellerWallet: '0xabc',
  fallbackMode: 'deny',
};

describe('PaymentRequirementBuilder', () => {
  it('builds a requirement with defaults and nonce', () => {
    const builder = new PaymentRequirementBuilder(baseConfig, 60_000);
    const requirement = builder.build({ price: '1.5', description: 'API access' });

    expect(requirement.amount).toBe('1.5');
    expect(requirement.asset).toBe('USDC');
    expect(requirement.network).toBe('base-mainnet');
    expect(requirement.seller).toBe('0xabc');
    expect(requirement.facilitator).toBe('https://facilitator.example.com');
    expect(requirement.description).toBe('API access');
    expect(requirement.nonce).toBeTypeOf('string');
    expect(new Date(requirement.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('overrides asset and network when provided', () => {
    const builder = new PaymentRequirementBuilder(baseConfig);
    const requirement = builder.build({
      price: '2',
      asset: 'DAI',
      network: 'base-sepolia',
    });

    expect(requirement.asset).toBe('DAI');
    expect(requirement.network).toBe('base-sepolia');
  });

  it('throws when price is missing', () => {
    const builder = new PaymentRequirementBuilder(baseConfig);
    // @ts-expect-error testing runtime validation
    expect(() => builder.build({})).toThrow();
  });
});
