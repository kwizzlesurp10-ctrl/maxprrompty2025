# Terraform Infrastructure

This directory contains Terraform configuration for provisioning Fly.io and Cloudflare resources.

## Prerequisites

1. **Terraform** >= 1.8.0 installed
2. **Fly.io API Token**: Create at https://fly.io/user/personal_access_tokens
3. **Cloudflare API Token**: Create at https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
   - Required permissions: `Account:Cloudflare R2:Edit`, `Account:Workers KV Storage:Edit`
4. **Cloudflare Account ID**: Found in your Cloudflare dashboard URL or API response

## Setup

1. Initialize Terraform:
   ```bash
   cd infra/terraform
   terraform init
   ```

2. Set credentials via environment variables (recommended):
   ```bash
   # Cloudflare (provider automatically reads CLOUDFLARE_API_TOKEN)
   export CLOUDFLARE_API_TOKEN="your-cloudflare-token"
   export TF_VAR_cloudflare_account_id="your-account-id"
   
   # Fly.io (provider automatically reads FLY_API_TOKEN)
   export FLY_API_TOKEN="your-fly-token"
   ```

   Or create `terraform.tfvars`:
   ```hcl
   cloudflare_account_id = "your-account-id"
   fly_app_name          = "antigravity-keith"  # optional, has default
   fly_org               = "personal"           # optional, has default
   r2_bucket             = "antigravity-objects" # optional, has default
   ```

   **Note**: Provider credentials (`CLOUDFLARE_API_TOKEN`, `FLY_API_TOKEN`) are best set as environment variables rather than in `.tfvars` files for security.

3. Review the plan:
   ```bash
   terraform plan
   ```

4. Apply the configuration:
   ```bash
   terraform apply
   ```

## Resources Created

- **Fly.io App**: `antigravity-keith` (or custom name)
- **Fly.io Volume**: R2 cache volume (10GB, ord region)
- **Cloudflare R2 Bucket**: For persistent object storage
- **Cloudflare Workers KV**: For metadata storage

## Outputs

After applying, Terraform will output:
- `fly_app`: The Fly.io application name
- `r2_bucket`: The R2 bucket name

## Provider Configuration

The providers are configured to use environment variables as the primary authentication method:

| Provider | Environment Variable | Variable Fallback |
|----------|---------------------|-------------------|
| Cloudflare | `CLOUDFLARE_API_TOKEN` | `var.cloudflare_api_token` |
| Fly.io | `FLY_API_TOKEN` | `var.fly_api_token` |

**Best Practice**: Set provider credentials via environment variables. The Cloudflare provider automatically reads `CLOUDFLARE_API_TOKEN` from the environment if not specified in the provider block.

## Notes

- The Cloudflare provider uses API tokens (recommended) instead of API keys
- Sensitive variables are marked as `sensitive = true` in `variables.tf`
- Never commit `.tfvars` files with real credentials to version control
- Environment variables are preferred for provider authentication (see provider documentation)

