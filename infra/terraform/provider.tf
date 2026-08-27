terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = "quantix-505516"
  region  = "us-east1"
  zone    = "us-east1-c"
}