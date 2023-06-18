#!/bin/bash

# Set the deployment directory
DEPLOY_DIR="/home/jonit/definya/api"

# Set the branch you want to deploy
BRANCH="master"

# Exit if the branch being pushed is not the specified branch
while read oldrev newrev refname; do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    if [ "$branch" != "$BRANCH" ]; then
        echo "Push to branch $branch ignored"
        exit 0
    fi
done

# Deploy the project
echo "Deploying project..."
GIT_WORK_TREE=$DEPLOY_DIR git checkout -f

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
echo "Restarting container..."
docker-compose restart

echo "Deployment complete."

