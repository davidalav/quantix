#!/bin/bash
# 1. Выделяем Swap (память)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 2. Установка Docker через официальный curl-скрипт
curl -fsSL https://docker.com -o get-docker.sh
sh get-docker.sh

# 3. Создаем рабочую директорию
mkdir -p /app
cd /app

# 4. Генерируем конфигурацию Nginx
cat << 'NN' > nginx.conf
server {
    listen 80;
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NN

# 5. Генерируем docker-compose.yml
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

# 6. Авторизуем Docker в Artifact Registry
gcloud auth configure-docker us-east1-docker.pkg.dev --quiet

# 7. Запускаем проект
docker compose up -d
