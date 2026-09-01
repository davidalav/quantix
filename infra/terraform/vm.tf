# 1. Машина для приложений (Next.js + FastAPI + Nginx)
resource "google_compute_instance" "quantix_app_vm" {
  name         = "quantix-app-vm"
  machine_type = "e2-micro"
  zone         = "us-east1-c"
  tags         = ["app-server"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.public_subnet.id
    access_config {
      nat_ip = google_compute_address.quantix_static_ip.address
    }
  }

  service_account {
    scopes = ["cloud-platform"]
  }

  # ВСЕ КОМАНДЫ ТУТ, БОЛЬШЕ НИКАКИХ ВНЕШНИХ ФАЙЛОВ:
  metadata_startup_script = <<EOF
#!/bin/bash
# Выделяем Swap (память)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Обновляем кэш и принудительно ставим Docker из стабильных пакетов GCP
apt-get update -y
apt-get install -y docker.io docker-compose-v2
mkdir -p /app
cd /app

# Генерируем конфигурацию Nginx
cat << 'NN' > nginx.conf
server {
    listen 80;
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
NN

# Генерируем docker-compose.yml
cat << 'DC' > docker-compose.yml
services:
  nginx:
    image: nginx:latest
    container_name: quantix-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
  frontend:
    image: us-east1-docker.pkg.dev/quantix-prod/quantix/frontend:latest
    container_name: quantix-frontend
    environment:
      - NEXT_PUBLIC_API_URL=/api
  backend:
    image: us-east1-docker.pkg.dev/quantix-prod/quantix/backend:latest
    container_name: quantix-backend
    environment:
      - DB_URL=postgresql://quantix:secret@10.0.2.4:5432/quantix
      - SECRET_KEY=my_secure_secret_key
    restart: on-failure
DC

# Авторизуем Docker в Artifact Registry проекта
gcloud auth configure-docker us-east1-docker.pkg.dev --quiet

# Запускаем проект
docker compose up -d
EOF
}

# 2. Изолированная машина для Базы Данных
resource "google_compute_instance" "quantix_db_vm" {
  name         = "quantix-db-vm"
  machine_type = "e2-micro"
  zone         = "us-east1-c"
  tags         = ["db-server"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.private_subnet.id
  }

  service_account {
    scopes = ["cloud-platform"]
  }

  metadata_startup_script = <<EOF
#!/bin/bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
apt-get update -y
apt-get install -y docker.io docker-compose-v2
mkdir -p /db_app
cd /db_app

cat << 'DB' > docker-compose.db.yml
services:
  db:
    image: postgres:15
    container_name: quantix-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: quantix
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: quantix
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U quantix -d quantix"]
      interval: 3s
      timeout: 3s
      retries: 10
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: always
volumes:
  db_data:
DB

docker compose -f docker-compose.db.yml up -d
EOF
}

