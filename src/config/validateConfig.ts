import type { X402Config } from './X402Config';
import { X402ConfigError } from '../errors';

/**
 * Validate and normalize an X402 configuration object.
 * Throws X402ConfigError if required fields are missing or invalid.
 */
export function validateConfig(config: X402Config): X402Config {
  if (!config) {
    throw new X402ConfigError('Config is required');
  }

  const requiredString = (value: unknown, name: string) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new X402ConfigError(`Config field "${name}" is required`);
    }
  };

  requiredString(config.facilitatorUrl, 'facilitatorUrl');
  requiredString(config.defaultNetwork, 'defaultNetwork');
  requiredString(config.defaultAsset, 'defaultAsset');
  requiredString(config.sellerWallet, 'sellerWallet');

  if (config.fallbackMode !== 'deny') {
    throw new X402ConfigError('Phase 0 requires fallbackMode to be "deny"');
  }

  return {
    ...config,
    facilitatorUrl: config.facilitatorUrl.trim(),
    defaultNetwork: config.defaultNetwork.trim(),
    defaultAsset: config.defaultAsset.trim(),
    sellerWallet: config.sellerWallet.trim(),
  };
}
