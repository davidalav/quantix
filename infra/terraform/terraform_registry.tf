resource "google_artifact_registry_repository" "quantix_artifact_registry" {
  location = "us-east1"
  repository_id = "quantix"
  format = "DOCKER"
}