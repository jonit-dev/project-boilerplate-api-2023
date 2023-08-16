#!/bin/bash

# avoid npm not found error
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Set the deployment directory
DEPLOY_DIR="/home/jonit/definya/api"

# Set the branch you want to deploy
BRANCH="release"

while read oldrev newrev refname; do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    if [ "$branch" != "$BRANCH" ]; then
        echo "Push to branch $branch ignored"
        exit 0
    fi
done

# Deploy the project!

echo "Refreshing source code"
GIT_WORK_TREE=$DEPLOY_DIR git checkout -f

cd ~/definya/api

# Generate a timestamp
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Make sure we rebuild the container because we need it for the swarm to sync
yarn tsc && yarn lint && yarn install 
docker build -t definya/definya-team:api-$TIMESTAMP .
docker push definya/definya-team:api-$TIMESTAMP

echo "🐳 Updating swarm..."

bash ~/definya/api/environment/api-refresh-containers.sh
