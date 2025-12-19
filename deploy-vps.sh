#!/bin/bash

###############################################################################
# VPS Deployment Script pour Portfolio Next.js
# 
# Utilisation:
#   ./deploy-vps.sh <VPS_IP> <USERNAME> <DOCKER_HUB_USERNAME>
#
# Exemple:
#   ./deploy-vps.sh 192.168.1.100 chloe chloe-docker
#
###############################################################################

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier les arguments
if [ $# -lt 3 ]; then
    echo -e "${RED}Usage: $0 <VPS_IP> <USERNAME> <DOCKER_HUB_USERNAME>${NC}"
    echo ""
    echo "Arguments:"
    echo "  VPS_IP                 - IP du VPS (ex: 192.168.1.100)"
    echo "  USERNAME               - Username SSH du VPS (ex: root)"
    echo "  DOCKER_HUB_USERNAME    - Nom d'utilisateur Docker Hub (ex: chloe)"
    echo ""
    echo "Exemple:"
    echo "  ./deploy-vps.sh 192.168.1.100 root chloe-docker"
    exit 1
fi

VPS_IP="$1"
USERNAME="$2"
DOCKER_HUB_USERNAME="$3"
DOCKER_IMAGE_NAME="chloe-portfolio"
DOCKER_REGISTRY="${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}"
VPS_HOME="/opt/portfolio"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📦 Portfolio Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  VPS IP: $VPS_IP"
echo "  SSH User: $USERNAME"
echo "  Docker Registry: $DOCKER_REGISTRY"
echo "  Deploy Path: $VPS_HOME"
echo ""

# Étape 1: Préparer le VPS
echo -e "${BLUE}[1/6] Initialisation du VPS...${NC}"
ssh "${USERNAME}@${VPS_IP}" bash << 'REMOTE_SCRIPT'
    echo "Détection du système d'exploitation..."
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        echo "OS détecté: $OS"
    fi

    # Installer Docker si absent
    if ! command -v docker &> /dev/null; then
        echo "Installation de Docker..."
        curl -fsSL https://get.docker.com | sh
        usermod -aG docker root
    fi

    # Installer Docker Compose si absent
    if ! command -v docker-compose &> /dev/null; then
        echo "Installation de Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    echo "Versions:"
    docker --version
    docker-compose --version
REMOTE_SCRIPT

echo -e "${GREEN}✓ VPS initialisé${NC}"
echo ""

# Étape 2: Créer le répertoire de déploiement
echo -e "${BLUE}[2/6] Création du répertoire de déploiement...${NC}"
ssh "${USERNAME}@${VPS_IP}" "mkdir -p ${VPS_HOME} && cd ${VPS_HOME} && pwd"
echo -e "${GREEN}✓ Répertoire créé${NC}"
echo ""

# Étape 3: Copier les fichiers de configuration
echo -e "${BLUE}[3/6] Copie des fichiers docker-compose.yml et .env...${NC}"

# Créer le fichier docker-compose.yml pour le VPS
cat > /tmp/docker-compose.yml << EOF
version: '3.8'

services:
  portfolio:
    image: ${DOCKER_REGISTRY}:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
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
      - portfolio-network

networks:
  portfolio-network:
    driver: bridge
EOF

scp /tmp/docker-compose.yml "${USERNAME}@${VPS_IP}:${VPS_HOME}/"
echo -e "${GREEN}✓ Fichiers copiés${NC}"
echo ""

# Étape 4: Pull l'image Docker
echo -e "${BLUE}[4/6] Téléchargement de l'image Docker...${NC}"
ssh "${USERNAME}@${VPS_IP}" "cd ${VPS_HOME} && docker pull ${DOCKER_REGISTRY}:latest"
echo -e "${GREEN}✓ Image téléchargée${NC}"
echo ""

# Étape 5: Démarrer les containers
echo -e "${BLUE}[5/6] Démarrage des containers...${NC}"
ssh "${USERNAME}@${VPS_IP}" "cd ${VPS_HOME} && docker-compose up -d"
echo ""
ssh "${USERNAME}@${VPS_IP}" "cd ${VPS_HOME} && docker-compose ps"
echo -e "${GREEN}✓ Containers démarrés${NC}"
echo ""

# Étape 6: Vérification de la santé
echo -e "${BLUE}[6/6] Vérification de la santé...${NC}"
sleep 5
echo "Vérification du health check..."
ssh "${USERNAME}@${VPS_IP}" << 'HEALTH_CHECK'
    MAX_RETRIES=10
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        STATUS=$(docker-compose ps portfolio 2>/dev/null | tail -1)
        if echo "$STATUS" | grep -q "healthy"; then
            echo "✓ Container est en bonne santé"
            break
        elif echo "$STATUS" | grep -q "Up"; then
            echo "Container en cours de démarrage... (tentative $((RETRY_COUNT + 1))/$MAX_RETRIES)"
        else
            echo "Erreur: Container non trouvé ou arrêté"
            exit 1
        fi
        RETRY_COUNT=$((RETRY_COUNT + 1))
        sleep 3
    done

    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "Avertissement: Le health check n'a pas passé après $MAX_RETRIES tentatives"
        echo "Logs du container:"
        docker-compose logs portfolio
        exit 1
    fi

    echo ""
    echo "Vérification de l'accès HTTP..."
    curl -s http://localhost:3000 > /dev/null && echo "✓ Portfolio accessible sur http://localhost:3000" || echo "Erreur: Portfolio non accessible"
HEALTH_CHECK

echo ""
echo -e "${GREEN}✓ Vérification complétée${NC}"
echo ""

# Résumé
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Déploiement réussi!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo ""
echo "1️⃣  Configuration du domaine (DNS):"
echo "   - Créer un enregistrement A pointant vers $VPS_IP"
echo "   - Attendre la propagation DNS (max 24h)"
echo ""
echo "2️⃣  Configuration HTTPS avec Let's Encrypt:"
echo "   ssh ${USERNAME}@${VPS_IP}"
echo "   certbot certonly --standalone -d votre-domaine.com"
echo ""
echo "3️⃣  Configuration Nginx (reverse proxy):"
echo "   - Voir DEPLOYMENT_GUIDE.md pour la configuration complète"
echo ""
echo "4️⃣  Commandes utiles:"
echo "   ssh ${USERNAME}@${VPS_IP} 'cd ${VPS_HOME} && docker-compose ps'"
echo "   ssh ${USERNAME}@${VPS_IP} 'cd ${VPS_HOME} && docker-compose logs -f portfolio'"
echo "   ssh ${USERNAME}@${VPS_IP} 'cd ${VPS_HOME} && docker-compose down'"
echo ""
echo -e "${YELLOW}Logs de déploiement sauvegardés dans deploy.log${NC}"
echo ""
