resource "google_compute_network" "quantix_vpc" {
  name                    = "quantix-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "public_subnet" {
  name          = "quantix-public-subnet"
  ip_cidr_range = "10.0.1.0/24"
  network       = google_compute_network.quantix_vpc.id
  region        = "us-east1"
}

resource "google_compute_subnetwork" "private_subnet" {
  name                     = "quantix-private-subnet"
  ip_cidr_range            = "10.0.2.0/24"
  network                  = google_compute_network.quantix_vpc.id
  region                   = "us-east1"
  private_ip_google_access = true
}
