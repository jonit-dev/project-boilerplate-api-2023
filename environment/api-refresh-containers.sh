#!/bin/bash

# Set the service name
SERVICE_NAME="swarm-stack_rpg-api"

# Additional deployment steps
cd ~/definya/api

# Export database
echo "🐳 Exporting database..."
npm run db:export:swarm

# Inform PM2 to initialize the graceful shutdown and run command
echo "🐳 Sending PM2 Graceful shutdown signal to swarm..."
bash ./environment/swarm-sigint-all.sh $SERVICE_NAME;

# Update the service to restart containers
echo "Restarting service..."
docker service update --force --with-registry-auth $SERVICE_NAME

echo "Deployment complete."
