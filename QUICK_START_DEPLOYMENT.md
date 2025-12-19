# 🚀 Guide Pas-à-Pas: De la Dev au VPS

Ce guide te montre exactement comment déployer ton portfolio de ton ordinateur vers un serveur VPS en quelques étapes simples.

---

## ✅ Status Actuel

| Composant | Status | Notes |
|-----------|--------|-------|
| Code Next.js | ✅ Prêt | Compilé et optimisé |
| Image Docker | ✅ Prêt | 293 MB, testée localement |
| docker-compose | ✅ Prêt | Configuration production-ready |
| Scripts déploiement | ✅ Prêt | Automatisés |
| Documentation | ✅ Prêt | Complète et détaillée |

---

## Prérequis

**Sur ton ordinateur local:**
- ✅ Docker Desktop installé et actif
- ✅ SSH client (builtin sur macOS/Linux)

**Sur le VPS:**
- Ubuntu 22.04+ / Debian 12+ / CentOS 8+
- Accès SSH root ou avec sudo
- Connexion Internet stable
- Minimum: 512 MB RAM, 500 MB disque

**Avant de commencer:**
- IP du VPS (ex: 192.168.1.100)
- Credentials SSH
- (Optionnel) Compte Docker Hub + domaine pour HTTPS

---

## Option A: Déploiement Simple (Direct depuis code)

### Étape 1: Vérifier que tout marche localement ✅ (DÉJÀ FAIT)

```bash
# L'image Docker est déjà créée et testée
docker images | grep chloe
# Output: chloe-portfolio   latest    71f96616cecf   293MB
```

### Étape 2: Initialiser le VPS (5 minutes)

```bash
# Depuis ton ordinateur, SSH sur le VPS
ssh root@<VPS_IP>

# Installer Docker et dependencies
curl -fsSL https://get.docker.com | sh

# Installer Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Vérifier
docker --version
docker-compose --version

# Exit SSH
exit
```

### Étape 3: Copier les fichiers sur le VPS (5 minutes)

```bash
# Depuis ton ordinateur local
VPS_IP="192.168.1.100"  # Remplacer par ton IP
mkdir -p /tmp/portfolio-deploy
cp docker-compose.yml Dockerfile .dockerignore /tmp/portfolio-deploy/

# Copier sur VPS
scp -r /tmp/portfolio-deploy/* root@${VPS_IP}:/opt/portfolio/

# Créer le dossier s'il n'existe pas
ssh root@${VPS_IP} "mkdir -p /opt/portfolio"
```

### Étape 4: Builder et lancer sur VPS (20 minutes)

```bash
# SSH sur VPS
ssh root@${VPS_IP}
cd /opt/portfolio

# Copier le Dockerfile et docker-compose.yml (si pas encore fait)
# puis builder l'image
docker build -t chloe-portfolio:latest .

# Lancer le container
docker-compose up -d

# Vérifier
docker-compose ps
docker-compose logs portfolio

# Exit SSH
exit
```

### ✅ Terminé!

Le portfolio est maintenant accessible sur:
```
http://<VPS_IP>:3000
```

Pour accéder par domaine et HTTPS, voir **Étape 5** ci-dessous.

---

## Option B: Déploiement Automatisé (Recommandé)

### Étape 1: Préparer l'image Docker

```bash
# L'image est déjà créée localement ✅
docker images | grep chloe
```

### Étape 2: Utiliser le script de déploiement automatisé

```bash
# Rendre le script exécutable (déjà fait)
chmod +x deploy-vps.sh

# Lancer le déploiement
# Syntaxe: ./deploy-vps.sh <VPS_IP> <USERNAME> <DOCKER_HUB_USERNAME>
./deploy-vps.sh 192.168.1.100 root chloe-docker

# Attendre 2-3 minutes...
# Le script fera automatiquement:
# 1. Initialiser le VPS
# 2. Créer les répertoires
# 3. Copier les fichiers
# 4. Démarrer les containers
# 5. Vérifier la santé
```

### ✅ C'est tout!

Le script affichera:
```
✅ Déploiement réussi!
Prochaines étapes:
1️⃣ Configuration du domaine (DNS)
2️⃣ Configuration HTTPS avec Let's Encrypt
...
```

---

## Étape 5: Configurer HTTPS avec ton domaine (optionnel)

### A. Pointer ton domaine vers le VPS

1. Aller chez ton registrar (GoDaddy, Namecheap, OVH, etc.)
2. Créer/modifier un enregistrement **A**:
   ```
   Type: A
   Name: @ (ou vide)
   Value: <IP_DE_TON_VPS>
   TTL: 3600 (ou défaut)
   ```
3. Sauvegarder et attendre la propagation DNS (max 24h)
4. Vérifier: `nslookup ton-domaine.com`

### B. Installer Nginx et Let's Encrypt

```bash
# SSH sur VPS
ssh root@<VPS_IP>

# Installer Nginx
apt update && apt install -y nginx certbot python3-certbot-nginx

# Arrêter Nginx temporairement
systemctl stop nginx

# Générer le certificat SSL
certbot certonly --standalone -d ton-domaine.com -d www.ton-domaine.com

# Répondre aux questions (email, accepter les conditions)
```

### C. Configurer Nginx comme reverse proxy

```bash
# Créer la configuration Nginx
sudo tee /etc/nginx/sites-available/portfolio > /dev/null << 'EOF'
# Redirection HTTP -> HTTPS
server {
    listen 80;
    server_name ton-domaine.com www.ton-domaine.com;
    return 301 https://$server_name$request_uri;
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    server_name ton-domaine.com www.ton-domaine.com;

    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/ton-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ton-domaine.com/privkey.pem;

    # Configuration SSL sécurisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy vers le container Docker
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
        proxy_read_timeout 60s;
    }
}
EOF

# Activer la configuration
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Supprimer la config default si elle existe
sudo rm -f /etc/nginx/sites-enabled/default

# Vérifier la syntaxe
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Activer le démarrage automatique
sudo systemctl enable nginx

# Exit SSH
exit
```

### D. Vérifier que tout fonctionne

```bash
# Depuis ton ordinateur
curl https://ton-domaine.com
# Devrait afficher le HTML du portfolio

# Ou visiter dans le navigateur:
# https://ton-domaine.com
```

### E. Activer le renouvellement automatique des certificats

```bash
# SSH sur VPS
ssh root@<VPS_IP>

# Tester le renouvellement automatique
sudo certbot renew --dry-run

# Vérifier que le timer est actif
sudo systemctl status certbot.timer

# Exit SSH
exit
```

---

## 🆘 Troubleshooting rapide

### Le container ne démarre pas?

```bash
ssh root@<VPS_IP>
cd /opt/portfolio
docker-compose logs portfolio

# Si problème de port occupé:
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
docker-compose restart
```

### HTTPS ne fonctionne pas?

```bash
ssh root@<VPS_IP>

# Vérifier le certificat
certbot certificates

# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Vérifier que port 443 est accessible
curl -I https://ton-domaine.com
```

### Mettre à jour le portfolio?

```bash
# Depuis ton ordinateur local
docker build -t chloe-portfolio:latest .
docker tag chloe-portfolio:latest votre-username/chloe-portfolio:latest
docker push votre-username/chloe-portfolio:latest

# Sur VPS
ssh root@<VPS_IP>
cd /opt/portfolio
docker-compose pull
docker-compose up -d
docker-compose logs -f
```

---

## 📊 Vérifier le déploiement

```bash
# Depuis ton ordinateur
ssh root@<VPS_IP>

# Vérifier les containers
docker ps

# Vérifier les logs
docker-compose logs portfolio

# Vérifier les ressources utilisées
docker stats

# Tester l'accès
curl http://localhost:3000

# Exit SSH
exit
```

---

## ✨ Félicitations!

Ton portfolio est maintenant accessible sur Internet via:
```
https://ton-domaine.com  ✅ HTTPS sécurisé
```

### Prochaines étapes optionnelles:

1. **Email de contact** - Intégrer Resend ou EmailJS dans le formulaire de contact
2. **Analytics** - Ajouter Vercel Analytics ou Plausible
3. **CI/CD** - Configurer GitHub Actions pour des déploiements automatiques
4. **Monitoring** - Mettre en place Uptime Robot ou Sentry

---

## 📚 Ressources

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guide complet avec toutes les options
- [Dockerfile](./Dockerfile) - Configuration du container
- [docker-compose.yml](./docker-compose.yml) - Orchestration Docker
- [deploy-vps.sh](./deploy-vps.sh) - Script de déploiement automatisé

---

**Date:** 2025-01-16  
**Version:** 1.0  
**Durée totale:** ~1 heure (init VPS + déploiement + HTTPS)
