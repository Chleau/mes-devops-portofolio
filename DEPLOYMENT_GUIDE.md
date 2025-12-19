# 🚀 Guide de Déploiement Docker - Portfolio

**Image Docker créée avec succès:** `chloe-portfolio:latest` (293 MB)  
**Image base:** Node.js 20 Alpine  
**Optimisation:** Multi-stage build, compression production

---

## 📋 Table des matières
1. [Prérequis](#prérequis)
2. [Déploiement local](#déploiement-local)
3. [Déploiement VPS](#déploiement-vps)
4. [Configuration SSL/HTTPS](#configurationhttps)
5. [Troubleshooting](#troubleshooting)

---

## Prérequis

### Pour développement local:
- ✅ Docker Desktop installé et actif
- ✅ macOS / Windows / Linux avec WSL2

### Pour VPS:
- ✅ Serveur Linux (Ubuntu 22.04+ / Debian 12+ / CentOS 8+)
- ✅ Accès SSH root ou avec sudo
- ✅ Domaine pour SSL (recommandé)
- ✅ Espace disque minimum: 500 MB
- ✅ RAM minimum: 512 MB (1 GB recommandé)

---

## Déploiement local

### Option 1: Exécuter l'image directement

```bash
# Lancer le container en développement (port 3000)
docker run -p 3000:3000 chloe-portfolio:latest

# Vérifier dans le navigateur
open http://localhost:3000
```

### Option 2: Utiliser docker-compose (recommandé)

```bash
# Lancer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### Vérification:
```bash
# Vérifier que le container est en cours d'exécution
docker ps | grep chloe

# Vérifier les logs
docker logs <container-id>

# Health check
curl http://localhost:3000
```

---

## Déploiement VPS

### Étape 1: Préparer le VPS

```bash
# 1. SSH sur le VPS
ssh root@your-vps-ip

# 2. Mettre à jour le système
apt update && apt upgrade -y

# 3. Installer Docker & Docker Compose
curl -fsSL https://get.docker.com | sh
usermod -aG docker root

# Installer Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Vérifier
docker --version
docker-compose --version
```

### Étape 2: Déployer le portfolio

**Option A: Depuis Docker Hub (recommandé pour production)**

```bash
# 1. Créer le répertoire
mkdir -p /opt/portfolio && cd /opt/portfolio

# 2. Cloner le repo ou créer docker-compose.yml
# Créer le fichier docker-compose.yml:
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  portfolio:
    image: votre-username/chloe-portfolio:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

networks:
  default:
    name: portfolio-network
EOF

# 3. Lancer le container
docker-compose up -d

# 4. Vérifier
docker-compose ps
```

**Option B: Depuis le code source (pour développement)**

```bash
# 1. Cloner le repo
cd /opt
git clone <your-repo-url> portfolio
cd portfolio

# 2. Construire l'image localement
docker build -t chloe-portfolio:latest .

# 3. Lancer avec docker-compose
docker-compose up -d

# 4. Vérifier
docker-compose logs -f
```

### Étape 3: Vérifier le déploiement

```bash
# Vérifier le container
docker ps

# Tester l'accès
curl http://localhost:3000

# Vérifier les logs
docker-compose logs portfolio
```

---

## Configuration HTTPS

### Avec Let's Encrypt (gratuit)

**Étape 1: Installer Certbot**

```bash
apt install -y certbot python3-certbot-nginx
```

**Étape 2: Générer le certificat**

```bash
# Remplacer "your-domain.com" par votre domaine
certbot certonly --standalone -d your-domain.com

# Répondre aux questions (email, accepter conditions)
# Les certificats seront dans: /etc/letsencrypt/live/your-domain.com/
```

**Étape 3: Configurer Nginx (reverse proxy)**

```bash
# Installer Nginx si ce n'est pas déjà fait
apt install -y nginx

# Créer la configuration
sudo tee /etc/nginx/sites-available/portfolio > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Activer la configuration
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

**Étape 4: Configuration du domaine (DNS)**

Dans votre registrar de domaine (GoDaddy, Namecheap, etc.):
- Créer un enregistrement DNS **A** pointant vers l'IP du VPS
- Attendre la propagation DNS (max 24h)
- Vérifier: `nslookup your-domain.com`

**Étape 5: Auto-renouvellement des certificats**

```bash
# Tester le renouvellement automatique
sudo certbot renew --dry-run

# Vérifier que le cron est actif
sudo systemctl status certbot.timer
```

---

## Commandes utiles

```bash
# 📊 Vérifier le status
docker-compose ps
docker-compose logs portfolio
docker ps -a

# 🔄 Redémarrer
docker-compose restart

# 🛑 Arrêter
docker-compose stop
docker-compose down

# 🚀 Relancer
docker-compose up -d

# 🧹 Nettoyer
docker system prune -a  # Supprimer les images inutilisées
docker volume prune      # Nettoyer les volumes

# 📈 Vérifier les ressources
docker stats

# 🔍 Vérifier la santé
curl http://localhost:3000
docker-compose ps  # Vérifier la colonne STATUS (healthy/unhealthy)
```

---

## Mise à jour du portfolio

### Depuis Docker Hub

```bash
cd /opt/portfolio

# 1. Télécharger la nouvelle image
docker-compose pull

# 2. Redémarrer avec la nouvelle version
docker-compose up -d

# 3. Vérifier
docker-compose logs -f
```

### Depuis le code source

```bash
cd /opt/portfolio

# 1. Mettre à jour le code
git pull origin main

# 2. Reconstruire l'image
docker build -t chloe-portfolio:latest .

# 3. Redémarrer
docker-compose up -d
```

---

## Troubleshooting

### Le container ne démarre pas

```bash
# Vérifier les logs
docker-compose logs portfolio

# Vérifier les ports disponibles
lsof -i :3000

# Redémarrer Docker
systemctl restart docker
```

### Port 3000 déjà utilisé

```bash
# Option 1: Tuer le processus
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Option 2: Utiliser un autre port dans docker-compose.yml
# Changer: ports: - "3000:3000"
# En:      ports: - "8080:3000"
```

### HTTPS ne fonctionne pas

```bash
# Vérifier le certificat
certbot certificates

# Renouveler manuellement
certbot renew --force-renewal

# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx
```

### La page affiche une erreur

```bash
# 1. Vérifier que le container est en cours d'exécution
docker-compose ps

# 2. Vérifier les logs
docker-compose logs -f

# 3. Tester directement
curl http://localhost:3000

# 4. Redémarrer complètement
docker-compose down
docker-compose up -d --remove-orphans
```

---

## Checklist de déploiement

- [ ] Image Docker construite avec succès (293 MB)
- [ ] Test local OK: `docker run -p 3000:3000 chloe-portfolio:latest`
- [ ] VPS préparé: Docker, Docker Compose, Nginx installés
- [ ] Image pushée vers Docker Hub (optionnel)
- [ ] docker-compose.yml déployé sur VPS
- [ ] Container lance sans erreurs: `docker-compose up -d`
- [ ] Accès HTTP fonctionnel: `curl http://localhost:3000`
- [ ] Domaine DNS pointant vers VPS
- [ ] Certificat Let's Encrypt généré
- [ ] Nginx configuré avec SSL
- [ ] HTTPS fonctionnel: `https://your-domain.com`
- [ ] Health check passe: Status = healthy
- [ ] Auto-renouvellement certs activé

---

## Support et ressources

- 🐳 Docker Docs: https://docs.docker.com/
- 🔐 Let's Encrypt: https://letsencrypt.org/
- 🔗 Nginx: https://nginx.org/
- 📚 Next.js Docker: https://nextjs.org/docs/deployment/docker

---

**Dernière mise à jour:** 2025-01-16  
**Version Next.js:** 16.1.0  
**Node.js:** 20-alpine  
**Image size:** 293 MB
