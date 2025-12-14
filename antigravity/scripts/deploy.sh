#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

# Setup Fly.io CLI PATH if installed in default location
if [ -d "$HOME/.fly/bin" ] && [[ ":$PATH:" != *":$HOME/.fly/bin:"* ]]; then
  export PATH="$HOME/.fly/bin:$PATH"
fi

printf '\n🛰  Antigravity one-command deploy\n'

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required" >&2
  exit 1
fi

if ! command -v fly >/dev/null 2>&1; then
  echo "Fly.io CLI is required (https://fly.io/docs/hands-on/install/)" >&2
  echo "Install with: curl -L https://fly.io/install.sh | sh" >&2
  echo "Then add to PATH: export PATH=\"\$HOME/.fly/bin:\$PATH\"" >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "Terraform is required" >&2
  exit 1
fi

pushd "$ROOT_DIR" >/dev/null

pnpm install
pnpm build

# Terraform: Attempt to provision infrastructure
# Note: Fly.io Terraform provider may be unavailable (discontinued)
# Fly.io app deployment happens separately via fly CLI
if [ -d "infra/terraform" ]; then
pushd infra/terraform >/dev/null
echo "Initializing Terraform..."
set +e  # Temporarily disable exit on error for Terraform
terraform init 2>&1
TERRAFORM_INIT_EXIT=$?
set -e  # Re-enable exit on error

if [ $TERRAFORM_INIT_EXIT -eq 0 ]; then
  echo "Applying Terraform configuration..."
  set +e
  terraform apply -auto-approve
  TERRAFORM_APPLY_EXIT=$?
  set -e
  if [ $TERRAFORM_APPLY_EXIT -ne 0 ]; then
    echo "⚠️  Terraform apply failed or skipped. Continuing with Fly.io deployment..."
  fi
else
  echo "⚠️  Terraform init failed (Fly.io provider may be unavailable). Continuing with Fly.io deployment..."
fi
popd >/dev/null
fi

# Deploy Fly.io app directly (fly.toml handles app configuration)
echo "Deploying to Fly.io..."
fly deploy --config fly.toml

printf '\n✅ Deploy complete\n'
