variable "fly_api_token" {
  type        = string
  description = "Fly.io access token (optional if FLY_API_TOKEN env var is set)"
  sensitive   = true
  default     = null
}

variable "fly_app_name" {
  type        = string
  description = "Fly application name"
  default     = "antigravity-keith"
}

variable "fly_org" {
  type        = string
  description = "Fly organization slug"
  default     = "personal"
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token (optional if CLOUDFLARE_API_TOKEN env var is set)"
  sensitive   = true
  default     = null
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID (can be set via TF_VAR_cloudflare_account_id env var)"
}

variable "r2_bucket" {
  type        = string
  description = "R2 bucket name"
  default     = "antigravity-objects"
}
