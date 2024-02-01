#!/bin/bash

# Set the service name
SERVICE_NAME="swarm-stack_boilerplate-api"

# Additional deployment steps
cd ~/laundrobot/api

# Export database
echo "🐳 Exporting database..."
npm run db:export:swarm

# Update the service to restart containers!!
echo "🐳Restarting swarm service..."

docker service update --force --with-registry-auth $SERVICE_NAME

echo "🐳 Deployment complete."


echo "🐳 Cleaning up..."
docker container prune -f

docker image prune -a -f
