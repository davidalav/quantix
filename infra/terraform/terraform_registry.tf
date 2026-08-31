resource "google_artifact_registry_repository" "quantix" {
  location = "us-east1"
  repository_id = "quantix"
  format = "DOCKER"

  depends_on = [google_project_service.artifact_registry] 
}