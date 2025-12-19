#!/bin/bash

# Script d'initialisation du VPS pour Docker
# Usage: curl -fsSL https://raw.githubusercontent.com/ton-repo/portfolio/main/vps-init.sh | bash

set -e

echo "🚀 Initialisation du VPS pour Portfolio Docker..."

# Déterminer le OS
if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS=$ID
else
  echo "❌ Impossible de déterminer le système d'exploitation"
  exit 1
fi

# Mise à jour du système
echo "📦 Mise à jour du système..."
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
  sudo apt-get update
  sudo apt-get upgrade -y
  sudo apt-get install -y curl wget git
elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
  sudo yum update -y
  sudo yum install -y curl wget git
else
  echo "⚠️  OS non reconnu: $OS"
fi

# Installer Docker
echo "🐳 Installation de Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm get-docker.sh
  
  # Ajouter l'utilisateur courant au groupe docker
  sudo usermod -aG docker $USER
  newgrp docker
  echo "✅ Docker installé"
else
  echo "✅ Docker déjà installé"
fi

# Installer Docker Compose
echo "🔧 Installation de Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  echo "✅ Docker Compose installé"
else
  echo "✅ Docker Compose déjà installé"
fi

# Installer Nginx (optionnel)
echo "📍 Installation de Nginx (optionnel)..."
read -p "Installer Nginx pour reverse proxy? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt-get install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
  elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
    sudo yum install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
  fi
  echo "✅ Nginx installé"
fi

# Installer Certbot pour SSL (optionnel)
echo "🔐 Installation de Certbot pour SSL (optionnel)..."
read -p "Installer Certbot pour Let's Encrypt SSL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt-get install -y certbot python3-certbot-nginx
  elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
    sudo yum install -y certbot python3-certbot-nginx
  fi
  echo "✅ Certbot installé"
fi

# Créer répertoire de déploiement
echo "📁 Création des répertoires..."
sudo mkdir -p /opt/portfolio
sudo chown $USER:$USER /opt/portfolio
cd /opt/portfolio

# Afficher le statut
echo ""
echo "==============================================="
echo "✅ VPS Initialisé avec succès!"
echo "==============================================="
docker --version
docker-compose --version
echo ""
echo "📋 Prochaines étapes:"
echo "1. Cloner le repository:"
echo "   git clone https://github.com/ton-repo/portfolio.git /opt/portfolio"
echo ""
echo "2. Modifier le script deploy.sh avec tes infos Docker"
echo ""
echo "3. Builder et déployer:"
echo "   cd /opt/portfolio"
echo "   ./deploy.sh all"
echo ""
echo "4. Configurer SSL (si Certbot installé):"
echo "   sudo certbot certonly --nginx -d ton-domaine.com"
echo ""
echo "==============================================="
