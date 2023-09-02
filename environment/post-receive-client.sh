#!/bin/bash

# avoid npm not found error
   export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Set the deployment directory
DEPLOY_DIR="/home/jonit/definya/client"

# Set the branch you want to deploy
BRANCH="release"

# Get the repository directory
REPO_DIR="/home/jonit/definya/client.git"

while read oldrev newrev refname; do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    if [ "$branch" != "$BRANCH" ]; then
        echo "Push to branch $branch ignored"
        exit 0
    fi
done

# Deploy the project
echo "Deploying project..."
git --work-tree=$DEPLOY_DIR --git-dir=$REPO_DIR checkout -f $BRANCH


echo "🐳Building docker image..."
docker build -t definya/definya-team:api-latest .
docker push definya/definya-team:api-latest

# Update repository code
cd ~/definya/client

# Clean untracked files if any
git clean -fd 

# Checkout the release branch and pull the latest changes
git checkout release
git pull origin release

# Update the service to restart containers and force image update
echo "🐳Restarting swarm service..."

docker service update --force swarm-stack_rpg-client
