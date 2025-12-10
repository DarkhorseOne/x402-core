# Repository Guidelines

## Project Structure & Module Organization
- Core source lives in `src/` with strict TypeScript settings; `src/index.ts` is the public entry point used by consumers.
- Protocol defaults and configuration helpers sit in `src/config/`; shared error types are in `src/errors/`.
- Payment flow logic is split between `src/payment/` (protocol primitives) and `src/facilitator/` (orchestration helpers).
- Cross-cutting helpers live in `src/utils/`. Build artifacts emit to `dist/` after compiling, and any additional design notes belong in `docs/`.

## Build, Test, and Development Commands
- Install dependencies once with `npm install`.
- `npm run build` runs `tsc` using `tsconfig.json` (rooted at `src/`, outputs `dist/` with declarations and source maps). Use this to validate types before opening a PR.
- `npm test` currently prints a placeholder; add a real runner (e.g., Jest or Vitest) and update the script before shipping tests.
- When adding new modules, export them through `src/index.ts` so the package surface stays consistent.

## Coding Style & Naming Conventions
- TypeScript strict mode is enabled; avoid `any` and prefer explicit return types on exported functions.
- Use 2-space indentation, camelCase for variables/functions, and PascalCase for classes/types/interfaces. Keep file and folder names kebab-case (`payment-request.ts`).
- Favor small, composable modules and named exports over large default exports. Keep protocol-specific constants near their domain folder (e.g., `src/payment/constants.ts`).
- Run `npm run build` as a lightweight lint/type check until a linter is added; do not commit build outputs.

## Testing Guidelines
- Place unit/integration specs in `tests/` (tsconfig already excludes it from builds). Name files `*.test.ts`.
- Cover happy-path payment flows, error handling in `src/errors/`, and facilitator orchestration edge cases.
- Once a framework is chosen, wire it to `npm test` and require it in PRs; prefer fast, deterministic tests over network-reliant ones.

## Commit & Pull Request Guidelines
- Use clear, imperative commit messages (`Add facilitator response parsing`, `Validate x402 payment headers`). Group related changes per commit.
- PRs should describe the change, rationale, and testing done. Link issues when applicable and include reproducible steps for reviewers.
- Include any protocol-impacting changes in the description and note migrations or config defaults affected in `src/config/`.

## Security & Configuration Tips
- Do not commit secrets or real payment credentials; keep sample values in `.env.example` if needed.
- Validate incoming config via the helpers in `src/config/` and prefer centralized guards over ad-hoc checks spread across modules.
