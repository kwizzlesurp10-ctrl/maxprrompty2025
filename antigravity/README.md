# Google Antigravity – Reference Implementation 2025

This monorepo is a deploy-ready blueprint for the **Google Antigravity** runtime described in the spec. It targets Cursor-first development, Vercel / Fly.io global deployments, and Groq/Together-hosted agent swarms.

## Stack
- **TypeScript 5 / React 19 / Next.js 15 App Router** (apps/web)
- **Three.js + @react-three/fiber + @react-three/rapier** (apps/spatial)
- **pnpm + Turborepo** orchestration with shared TS config
- **Supabase** (auth, Postgres, realtime) & **Fly.io** (edge compute) infra codified in Terraform
- **Cloudflare R2 + KV**, Dolby.io, Solana Pay integrations stubbed for quick completion

## Getting Started
```bash
pnpm install
pnpm dev        # turbo dev across apps
pnpm --filter web dev      # start Next.js (port 3000)
pnpm --filter spatial dev  # start Vite spatial host (port 4173) + realtime server (port 8787)
```

### Ports
- **web**: `http://localhost:3000` (Next.js App Router)
- **spatial**: `http://localhost:4173` (Three.js + R3F client)
- **realtime**: `ws://localhost:8787` (Yjs WebSocket server for CRDT sync)

### Testing Realtime Sync
1. Start all services: `pnpm dev`
2. Open `http://localhost:3000/world` in one browser tab
3. Open `http://localhost:4173` in another tab (or same browser)
4. Click "Spawn Cube" in the web app
5. Verify the object count updates in both tabs
6. Objects should appear in the spatial view as cubes

## Deployment
One command deploy mirrors the spec:
```bash
curl -fsSL https://antigravity.keith.sh/deploy.sh | bash
```
Locally, run `pnpm deploy` which executes `scripts/deploy.sh` with Fly.io + Terraform steps.

## Workspace Layout
```
antigravity/
  apps/
    web/       # Next.js 15 App Router
    spatial/   # Vite + Three.js worker host
  packages/
    sdk/
    shared/
    ai-agents/
  infra/
    terraform/ # Fly.io + Cloudflare R2 provisioning
    supabase/  # Supabase CLI config
  turbo.json
  pnpm-workspace.yaml
```

Each package exposes typed APIs consumed by both apps. See the respective directories for details.
