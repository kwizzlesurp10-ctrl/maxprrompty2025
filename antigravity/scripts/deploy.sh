#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

printf '\n🛰  Antigravity one-command deploy\n'

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required" >&2
  exit 1
fi

if ! command -v fly >/dev/null 2>&1; then
  echo "Fly.io CLI is required (https://fly.io/docs/hands-on/install/)" >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "Terraform is required" >&2
  exit 1
fi

pushd "$ROOT_DIR" >/dev/null

pnpm install
pnpm build

pushd infra/terraform >/dev/null
terraform init
terraform apply -auto-approve
popd >/dev/null

fly deploy --config fly.toml

printf '\n✅ Deploy complete\n'
