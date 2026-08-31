# Разрешаем веб-трафик к публичной машине
resource "google_compute_firewall" "allow_web_traffic" {
  name    = "allow-web-traffic"
  network = google_compute_network.quantix_vpc.id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000", "8000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["app-server"]
}

# БЕЗОПАСНОСТЬ: Разрешаем подключение по SSH через Google IAP туннель для ВСЕХ машин в сети
resource "google_compute_firewall" "allow_iap_ssh" {
  name    = "allow-iap-ssh"
  network = google_compute_network.quantix_vpc.id

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"]
  # Строку target_tags удалили, теперь правило применяется ко всей сети quantix-vpc
}


# Разрешаем бэкенду доступ к БД внутри приватной подсети
resource "google_compute_firewall" "allow_app_to_db" {
  name    = "allow-app-to-db"
  network = google_compute_network.quantix_vpc.id

  allow {
    protocol = "tcp"
    ports    = ["5432"] 
  }

  source_tags = ["app-server"]
  target_tags = ["db-server"]
}
