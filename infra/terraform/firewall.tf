resource "google_compute_firewall" "allow_nextjs_fastapi" {
  name    = "allow-nextjs-fastapi"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["3000", "8000"]
  }

  source_ranges = ["0.0.0.0/0"]
}