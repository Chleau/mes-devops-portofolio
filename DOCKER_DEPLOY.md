# 🐳 Guide de Déploiement Docker - Portfolio Chloé

## 📋 Prérequis

### Sur ta machine locale:
- ✅ Docker Desktop installé ([https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop))
- ✅ Compte Docker Hub ([https://hub.docker.com](https://hub.docker.com))
- ✅ Git configuré

### Sur ton VPS:
- ✅ Docker installé ([Guide d'installation](https://docs.docker.com/engine/install/ubuntu/))
- ✅ Docker Compose installé
- ✅ SSH accès configuré
- ✅ Port 3000 (ou autre) ouvert

---

## 🚀 Déploiement Rapide (5 min)

### 1️⃣ Construire l'image Docker localement

```bash
cd /Users/chloe2/Documents/mds2/devops/portfolio

# Option 1: Utiliser le script (recommandé)
chmod +x deploy.sh
./deploy.sh build

# Option 2: Commande manuelle
docker build -t chloe-portfolio:latest .
```

### 2️⃣ Tester localement

```bash
# Lancer le conteneur localement
docker run -d \
  --name portfolio-test \
  -p 3000:3000 \
  chloe-portfolio:latest

# Vérifier que ça marche
curl http://localhost:3000

# Voir les logs
docker logs -f portfolio-test

# Arrêter
docker stop portfolio-test
docker rm portfolio-test
```

### 3️⃣ Pusher vers Docker Hub

```bash
# Se connecter à Docker Hub
docker login

# Tagger l'image
docker tag chloe-portfolio:latest YOUR_USERNAME/chloe-portfolio:latest

# Pusher
docker push YOUR_USERNAME/chloe-portfolio:latest
```

### 4️⃣ Déployer sur VPS

#### Option A: Via SSH (Recommandé pour dev)

```bash
# SSH vers ton VPS
ssh root@your-vps-ip

# Cloner le repo
cd /opt
git clone https://github.com/ton-username/portfolio.git
cd portfolio

# Modifier le script deploy.sh avec tes infos
nano deploy.sh  # Changer USERNAME et REGISTRY

# Rendre exécutable et déployer
chmod +x deploy.sh
./deploy.sh all
```

#### Option B: Docker Compose sur VPS

```bash
# Sur le VPS
cd /opt/portfolio

# Démarrer avec docker-compose
docker-compose up -d

# Vérifier
docker-compose ps
docker-compose logs -f
```

#### Option C: Avec Nginx Reverse Proxy (Recommandé Production)

Voir section **Nginx Setup** ci-dessous.

---

## 🔧 Configuration Avancée

### Docker Compose Complet (avec Nginx)

```yaml
version: '3.8'

services:
  portfolio:
    image: your-username/chloe-portfolio:latest
    container_name: chloe-portfolio
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - portfolio-network

  nginx:
    image: nginx:latest
    container_name: portfolio-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    depends_on:
      - portfolio
    networks:
      - portfolio-network

networks:
  portfolio-network:
    driver: bridge
```

### Configuration Nginx (nginx.conf)

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/javascript application/json application/javascript;

    upstream nextjs_backend {
        server portfolio:3000;
    }

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL certificates (générer avec Let's Encrypt)
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # SSL security
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Compression
        gzip on;
        gzip_types text/plain text/css application/javascript;

        location / {
            proxy_pass http://nextjs_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /_next/static {
            proxy_pass http://nextjs_backend;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
    }
}
```

---

## 🔐 Certificat SSL (Let's Encrypt)

```bash
# Sur le VPS, installer Certbot
apt-get update
apt-get install certbot python3-certbot-nginx

# Générer le certificat
certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copier les certificats
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem

# Auto-renouvellement
certbot renew --dry-run
```

---

## 📊 Monitoring & Logs

```bash
# Afficher les logs du conteneur
docker logs -f chloe-portfolio

# Voir les stats de ressources
docker stats chloe-portfolio

# Inspecteur du conteneur
docker inspect chloe-portfolio

# Vérifier la santé
docker inspect --format='{{.State.Health.Status}}' chloe-portfolio
```

---

## 🔄 CI/CD avec GitHub Actions (Optionnel)

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

env:
  REGISTRY: docker.io
  IMAGE_NAME: your-username/chloe-portfolio

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Registry
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/portfolio
            docker-compose pull
            docker-compose up -d
            docker-compose logs
```

---

## 🆘 Troubleshooting

| Problème | Solution |
|----------|----------|
| Port déjà utilisé | `docker stop $(docker ps -q)` ou changer le port dans docker-compose |
| Image trop volumineuse | Vérifier .dockerignore, nettoyer node_modules |
| Conteneur crash | `docker logs container_name` pour voir l'erreur |
| Mémoire insuffisante | Augmenter les limites dans docker-compose ou sur VPS |
| DNS non résolvé | Vérifier `/etc/resolv.conf` sur VPS |

---

## 📋 Checklist de Déploiement

- [ ] Docker installé localement
- [ ] Compte Docker Hub créé
- [ ] VPS préparé (Docker + Ports ouverts)
- [ ] SSH key configurée
- [ ] Script deploy.sh modifié (USERNAME)
- [ ] Image testée localement
- [ ] Image pushée sur Docker Hub
- [ ] Déploiement sur VPS réussi
- [ ] Domaine pointé vers VPS
- [ ] SSL configuré (Let's Encrypt)
- [ ] Nginx proxy en place
- [ ] Monitoring configuré

---

## 🎯 Commandes Utiles

```bash
# Nettoyer les images Docker inutilisées
docker image prune -a

# Nettoyer les conteneurs arrêtés
docker container prune

# Voir les volumes
docker volume ls

# Vérifier l'usage disque
docker system df

# Redémarrer le service Docker
sudo systemctl restart docker

# Vérifier la version Docker
docker --version
docker-compose --version
```

---

**Questions? Besoin d'aide? Jette un oeil aux logs! 🔍**
