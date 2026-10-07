terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = "quantix-prod"
  region  = "us-east1"
  zone    = "us-east1-c"
}

resource "google_project_service" "artifact_registry" {
  project            = "quantix-prod"
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_iam_member" "iap_tunnel_user" {
  project = "quantix-prod"
  role    = "roles/iap.tunnelResourceAccessor"
  member  = "user:davidalaverdyan0@gmail.com"
}

data "google_project" "project" {}

resource "google_project_iam_member" "allow_vm_to_pull_images" {
  project = "quantix-prod"
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}
