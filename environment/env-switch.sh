#!/bin/bash

case $1 in
"dev")
  echo "Generating Development environment .env files"
  cp -fr ./environment/dev.env .env
  cp -fr ./environment/docker-compose.dev.yml docker-compose.yml
  cp -fr ./environment/Dockerfile.dev Dockerfile
  ;;
"prod")
  echo "Generating Production environment .env files"
  cp -fr ./environment/prod.env .env
  cp -fr ./environment/docker-compose.prod.yml docker-compose.yml
  cp -fr ./environment/Dockerfile.prod Dockerfile
  ;;
esac

echo "✅ Done! Note that you should run 'docker-compose build rpg-api' to rebuild your container with the new changes applied.'"
