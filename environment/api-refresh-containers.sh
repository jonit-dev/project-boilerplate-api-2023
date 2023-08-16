#!/bin/bash

# Set the service name
SERVICE_NAME="swarm-stack_rpg-api"

# Additional deployment steps
cd ~/definya/api

# Export database
npm run db:export

# Inform PM2 to initialize the graceful shutdown and run command
echo "Shutting down instances..."
docker service ps --format "{{.Node}} {{.Name}}.{{.ID}}" $SERVICE_NAME | while read node task_name; do
  docker --host $node exec $task_name bash -c 'pm2 sendSignal SIGINT rpg-api'
done

# Update the service to restart containers
echo "Restarting service..."
docker service update --force --with-registry-auth $SERVICE_NAME

echo "Deployment complete."
