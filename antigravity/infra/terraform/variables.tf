variable "fly_api_token" {
  type        = string
  description = "Fly.io access token"
  sensitive   = true
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
  description = "Cloudflare API token"
  sensitive   = true
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID"
}

variable "r2_bucket" {
  type        = string
  description = "R2 bucket name"
  default     = "antigravity-objects"
}
