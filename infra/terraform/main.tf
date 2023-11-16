terraform {
  backend "gcs" {
    prefix = "infrastructure"
  }
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.3.1"
    }
    google = {
      version = "3.71.0"
    }
  }
}
