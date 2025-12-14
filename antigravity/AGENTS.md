# Repository Guidelines

## Project Structure & Module Organization

- Monorepo managed by pnpm + Turborepo. Apps live in `apps/`, shared libraries in `packages/`, infra in `infra/`.
- `apps/web` is the Next.js 15 App Router frontend (React 19). `apps/spatial` is the Vite + R3F host with a realtime server in `src/realtime/server.ts`.
- `packages/shared` holds cross-cutting types and schemas, `packages/sdk` publishes the `@google/antigravity` client, and `packages/ai-agents` contains agent-facing utilities.
- TypeScript path aliases are defined in `tsconfig.base.json` (e.g., `@antigravity/shared`, `@/lib/*`). Prefer colocating domain modules under `src/` in their owning package.

## Build, Test, and Development Commands

- `pnpm install` to set up dependencies.
- `pnpm dev` runs all dev servers via Turbo; use `pnpm --filter web dev` or `pnpm --filter spatial dev` to scope.
- `pnpm build` triggers Turbo builds; individual packages run `tsc` and apps run `next build`/`vite build`.
- `pnpm lint` executes each package’s lint task (`next lint`, `eslint`).
- `pnpm test` fans out to Vitest suites where present; scope with `pnpm --filter shared test` (etc.) for faster loops.

## Coding Style & Naming Conventions

- TypeScript with `strict` + `moduleResolution: bundler`; prefer ES modules and React function components.
- Follow ESLint + Prettier defaults (2-space indentation, semicolons per formatter). Run `pnpm lint` before pushing.
- Name files by feature (`scene-store.ts`, `agent-registry.ts`); tests as `*.test.ts` or `*.test.tsx` near the code they cover.
- Use provided aliases instead of deep relative paths; avoid duplicating types already in `packages/shared`.

## Testing Guidelines

- Vitest is the test runner across packages and apps; add minimal fixtures/mocks to keep suites fast.
- Cover core behaviors (schema validation, networking contracts, realtime sync handlers) and critical UI flows.
- Prefer unit-level tests close to modules; add integration tests only where APIs cross package boundaries.
- Aim for meaningful assertions over coverage quotas; document complex setups in test file headers if needed.

## Commit & Pull Request Guidelines

- Git history is sparse; write concise, imperative subject lines (e.g., “Add spatial sync guard”). Keep body wrapped at ~72 chars when explaining rationale.
- For PRs: include a short summary, linked issue/Task ID, screenshots for UI changes, and reproduction or test steps (`pnpm test`, `pnpm --filter web lint`).
- Note any infra/config changes in `infra/` or `scripts/`; call out required secrets or env vars when applicable.
