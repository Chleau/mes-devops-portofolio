#!/bin/bash

# Script de déploiement Docker pour VPS
# Usage: ./deploy.sh [build|push|deploy|stop|logs]

set -e

# Configuration
REGISTRY="docker.io"  # ou votre registry privé
USERNAME="votre-username"  # Remplacer par votre username Docker Hub
IMAGE_NAME="chloe-portfolio"
IMAGE_TAG="latest"
FULL_IMAGE="$REGISTRY/$USERNAME/$IMAGE_NAME:$IMAGE_TAG"
CONTAINER_NAME="chloe-portfolio"
PORT="3000"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

echo_error() {
  echo -e "${RED}✗ $1${NC}"
}

echo_info() {
  echo -e "${YELLOW}➜ $1${NC}"
}

# Fonction: Builder l'image Docker
build_image() {
  echo_info "Construction de l'image Docker..."
  docker build -t $FULL_IMAGE .
  echo_success "Image construite avec succès!"
}

# Fonction: Push vers le registry
push_image() {
  echo_info "Authentification Docker..."
  docker login -u $USERNAME
  
  echo_info "Push de l'image vers $REGISTRY..."
  docker push $FULL_IMAGE
  echo_success "Image pushée avec succès!"
}

# Fonction: Déployer sur le VPS
deploy_vps() {
  echo_info "Arrêt du conteneur existant..."
  docker stop $CONTAINER_NAME 2>/dev/null || true
  docker rm $CONTAINER_NAME 2>/dev/null || true
  
  echo_info "Pull de la dernière image..."
  docker pull $FULL_IMAGE
  
  echo_info "Démarrage du nouveau conteneur..."
  docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    --restart unless-stopped \
    --health-cmd='wget --quiet --tries=1 --spider http://localhost:3000 || exit 1' \
    --health-interval=30s \
    --health-timeout=10s \
    --health-retries=3 \
    $FULL_IMAGE
  
  echo_success "Conteneur déployé avec succès!"
  echo_info "App accessible sur http://localhost:$PORT"
}

# Fonction: Arrêter le conteneur
stop_container() {
  echo_info "Arrêt du conteneur..."
  docker stop $CONTAINER_NAME || true
  docker rm $CONTAINER_NAME || true
  echo_success "Conteneur arrêté!"
}

# Fonction: Afficher les logs
show_logs() {
  echo_info "Logs du conteneur..."
  docker logs -f $CONTAINER_NAME
}

# Fonction: Vérifier la santé
health_check() {
  echo_info "Vérification de la santé du conteneur..."
  if docker ps | grep -q $CONTAINER_NAME; then
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "no healthcheck")
    if [ "$STATUS" = "healthy" ]; then
      echo_success "Conteneur en bonne santé!"
    else
      echo_error "Conteneur unhealthy: $STATUS"
    fi
  else
    echo_error "Conteneur non actif"
  fi
}

# Menu principal
case "${1:-help}" in
  build)
    build_image
    ;;
  push)
    push_image
    ;;
  deploy)
    deploy_vps
    ;;
  stop)
    stop_container
    ;;
  logs)
    show_logs
    ;;
  health)
    health_check
    ;;
  all)
    build_image
    push_image
    deploy_vps
    health_check
    ;;
  *)
    echo "Usage: $0 {build|push|deploy|stop|logs|health|all}"
    echo ""
    echo "Commandes:"
    echo "  build   - Construire l'image Docker localement"
    echo "  push    - Pusher l'image vers Docker Hub/Registry"
    echo "  deploy  - Déployer le conteneur sur le VPS"
    echo "  stop    - Arrêter et supprimer le conteneur"
    echo "  logs    - Afficher les logs du conteneur"
    echo "  health  - Vérifier la santé du conteneur"
    echo "  all     - Exécuter build → push → deploy → health"
    exit 1
    ;;
esac
