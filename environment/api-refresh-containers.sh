#!/bin/bash

# Set the service name
SERVICE_NAME="swarm-stack_rpg-api"

# Additional deployment steps
cd ~/definya/api

# Export database
echo "🐳 Exporting database..."
npm run db:export:swarm

# Update the service to restart containers

echo "Restarting service..."
docker service update --force --with-registry-auth $SERVICE_NAME

echo "Deployment complete."
