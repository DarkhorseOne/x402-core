# x402-core

Framework-agnostic core for the x402 HTTP payment standard. This package builds `402 Payment Required` responses, extracts payment credentials, and verifies payments through a facilitator API — all without any framework or storage dependencies (Phase 0 is fully stateless).

## Status
- Phase 0 scope only: no DB, Redis, queues, or credit fallback; `fallbackMode` must be `"deny"`.
- Node.js ≥ 20, TypeScript ≥ 5, strict mode enabled.

## Install
```bash
npm install @darkhorseone/x402-core
```

## Quick Start
```ts
import {
  PaymentRequirementBuilder,
  PaymentCredentialExtractor,
  HttpFacilitatorAdapter,
  type X402Config,
} from "@darkhorseone/x402-core";

const config: X402Config = {
  facilitatorUrl: "https://facilitator.example.com",
  defaultNetwork: "base-mainnet",
  defaultAsset: "USDC",
  sellerWallet: "0x123...",
  fallbackMode: "deny",
};

const builder = new PaymentRequirementBuilder(config);
const requirement = builder.build({ price: "1.0", description: "API access" });

const extractor = new PaymentCredentialExtractor();
const credential = extractor.extract(request); // header, body, or query param

const facilitator = new HttpFacilitatorAdapter(config);
const result = await facilitator.verifyPayment(credential);
```

## Project Layout
- `src/config/` config types and helpers (e.g., `X402Config`).
- `src/payment/` payment requirement builder, credential extraction, verification interfaces.
- `src/facilitator/` facilitator client contracts and HTTP adapter.
- `src/errors/` typed errors (`PaymentRequiredError`, `PaymentInvalidError`, etc.).
- `src/utils/` shared utilities (logger, request ids).
- `docs/DESIGN.md` architecture and Phase 0 scope; `docs/DEV_STANDARDS.md` coding/testing standards.

## Configuration (core fields)
`X402Config` includes `facilitatorUrl`, `defaultNetwork`, `defaultAsset`, `sellerWallet`, optional `apiKey`, and optional `tenantResolver`/`logger`. Phase 0 enforces `fallbackMode: "deny"`. Use `validateConfig(config)` to guard required fields early.

## Development
- `npm run build` — compile with `tsc` (ES2022 output, declarations + source maps to `dist/`).
- `npm test` — run Vitest suite (credential extraction, requirement builder, verifier, HTTP facilitator adapter).
- Export new modules through `src/index.ts` to keep the public API consistent.

## Error Handling
Use the provided typed errors from `src/errors/` rather than generic `Error`. Facilitator outages should map to `PaymentNetworkError`.

## Contributing
Follow the architecture and style rules in `docs/DESIGN.md` and `docs/DEV_STANDARDS.md`. Keep implementations stateless, framework-agnostic, and free of external runtime dependencies.
