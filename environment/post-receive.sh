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

bash ./backup-and-restart-containers.sh

