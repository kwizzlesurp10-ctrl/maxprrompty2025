terraform {
  required_version = ">= 1.8.0"

  required_providers {
    fly = {
      source  = "fly-apps/fly"
      version = "~> 0.1"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "fly" {
  access_token = var.fly_api_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "fly_app" "antigravity" {
  name = var.fly_app_name
  org  = var.fly_org
}

resource "fly_volume" "r2_cache" {
  app          = fly_app.antigravity.name
  name         = "r2-cache"
  region       = "ord"
  size_gb      = 10
  snapshot_retention = 3
}

resource "cloudflare_r2_bucket" "objects" {
  account_id = var.cloudflare_account_id
  name       = var.r2_bucket
}

resource "cloudflare_workers_kv_namespace" "metadata" {
  account_id = var.cloudflare_account_id
  title      = "antigravity-metadata"
}

output "fly_app" {
  value = fly_app.antigravity.name
}

output "r2_bucket" {
  value = cloudflare_r2_bucket.objects.name
}
