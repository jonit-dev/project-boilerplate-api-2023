#!/bin/bash

ROOT_FOLDER="$(cd ../ && pwd)"
ABSOLUTE_PATH=${PWD##*/} 
PROJECT_FOLDER="$ROOT_FOLDER/$ABSOLUTE_PATH"
PROD_ENV="$PROJECT_FOLDER/.env"
BACKUPS_FOLDER="./environment/backups"
BACKUP_FILE="$BACKUPS_FOLDER/db-dump.zip"

[ ! -d "$BACKUPS_FOLDER" ] && echo "/environment/backups folder do not exist! Please, create one before proceeding" && exit

echo "Loading production .env from ${PROD_ENV}"

# Fetch mongodb username and password, so we can dump our data into a file
USERNAME=$(awk -F'=' '/^MONGO_INITDB_ROOT_USERNAME/ { print $2}'  "$PROD_ENV")
PASSWORD=$(awk -F'=' '/^MONGO_INITDB_ROOT_PASSWORD/ { print $2}' "$PROD_ENV")
PORT=$(awk -F'=' '/^MONGO_PORT/ { print $2}' "$PROD_ENV")

# Find the Task ID of the Running MongoDB Service
TASK_ID=$(docker service ps -q --filter 'desired-state=running' swarm-stack_laundy-db)

# Find the Container ID Associated with the Task ID
CONTAINER_ID=$(docker inspect --format '{{.Status.ContainerStatus.ContainerID}}' $TASK_ID)

# Execute dump command to export db files to mongo container
docker exec "$CONTAINER_ID" mongodump -u ${USERNAME} -p ${PASSWORD} --port ${PORT}  -o /db-dump/

# then we copy these files (under dump folder) to our host
mkdir -p "$BACKUPS_FOLDER"

docker cp "$CONTAINER_ID:/db-dump" "$BACKUPS_FOLDER/db-dump"

cd "$BACKUPS_FOLDER"

zip -r "db-dump.zip" "./db-dump"

chmod 755 "./db-dump.zip"

# Lets do some cleanup, so we don't mess up our importing later
echo "Finished, deleting db-dump folder..."
rm -rf "./db-dump"
