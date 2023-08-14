#!/bin/bash

# Set the deployment directory
DEPLOY_DIR="/home/jonit/definya/api"

# Set the branch you want to deploy
BRANCH="release"

# Get the repository directory
REPO_DIR="/home/jonit/definya/api.git"

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

bash ~/definya/api/environment/backup-and-restart-containers.sh
