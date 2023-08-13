#!/bin/bash

# Additional deployment steps
cd ~/definya/api

# Db backup
npm run db:export

# Inform PM2 to initialize the graceful shutdown and run command
echo "Shutting down instances..."
docker exec rpg-api bash -c 'pm2 sendSignal SIGINT rpg-api'

# Stop the container after shutting down all instances
echo "Stopping container..."
docker-compose stop rpg-api

# Initialize container with new code
echo "Restarting containers..."
docker-compose restart

echo "Deployment complete."

# Exit with success
exit 0
