resource "google_compute_instance" "quantix_vm" {
    name = "quantix-vm"
    machine_type = "e2-micro"
    zone = "us-east1-c"
    tags = ["http-server", "https-server"]

    boot_disk {
        initialize_params {
            image = "ubuntu-os-cloud/ubuntu-2204-lts"
        }
    }

    network_interface {
        network = "default"
        access_config {}
    }

    service_account {
        email  = "701948162030-compute@developer.gserviceaccount.com"
        scopes = [
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring.write",
            "https://www.googleapis.com/auth/service.management.readonly",
            "https://www.googleapis.com/auth/servicecontrol",
            "https://www.googleapis.com/auth/trace.append",
        ]
    }

    lifecycle {
        ignore_changes = [
            boot_disk[0].initialize_params[0].image,
            metadata,
            labels,
        ]
    }
}