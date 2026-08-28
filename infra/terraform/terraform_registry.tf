resource "google_artifact_registry_repository" "quantix" {
  location = "us-east1"
  repository_id = "quantix"
  format = "DOCKER"
}