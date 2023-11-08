#!/bin/bash

# Constants
ROOT_FOLDER="$(cd ../ && pwd)"
ABSOLUTE_PATH=${PWD##*/}
PROJECT_FOLDER="$ROOT_FOLDER/$ABSOLUTE_PATH"
PROD_ENV="$PROJECT_FOLDER/.env"
BACKUPS_FOLDER="$PROJECT_FOLDER/environment/backups"
DB_DUMP_ZIP="$BACKUPS_FOLDER/db-dump.zip"
DB_DUMP_FOLDER="$BACKUPS_FOLDER/db-dump"

# Fetch MongoDB details
USERNAME=$(awk -F'=' '/^MONGO_INITDB_ROOT_USERNAME/ { print $2}' "$PROD_ENV")
PASSWORD=$(awk -F'=' '/^MONGO_INITDB_ROOT_PASSWORD/ { print $2}' "$PROD_ENV")
PORT=$(awk -F'=' '/^MONGO_PORT/ { print $2}' "$PROD_ENV")

# Validate the backup folder exists
[ ! -d "$BACKUPS_FOLDER" ] && echo "/environment/backups folder does not exist! Please, create one before proceeding." && exit

# Validate the backup file exists
[ ! -f "$DB_DUMP_ZIP" ] && echo "Backup file does not exist! Please, create one before proceeding." && exit

# Find the Task ID of the Running MongoDB Service
TASK_ID=$(docker service ps -q --filter 'desired-state=running' swarm-stack_laundy-db)

# Find the Container ID Associated with the Task ID
CONTAINER_ID=$(docker inspect --format '{{.Status.ContainerStatus.ContainerID}}' $TASK_ID)

# Validation
[ -z "$USERNAME" ] && echo "MONGO_INITDB_ROOT_USERNAME is empty. Check your .env file." && exit
[ -z "$PASSWORD" ] && echo "MONGO_INITDB_ROOT_PASSWORD is empty. Check your .env file." && exit
[ -z "$PORT" ] && echo "MONGO_PORT is empty. Check your .env file." && exit
[ -z "$CONTAINER_ID" ] && echo "Could not find the MongoDB container ID. Check if the service is running." && exit


echo "⚙️ Importing database to container $CONTAINER_ID on port $PORT with user $USERNAME..."

# Unzip the database data
cd "$BACKUPS_FOLDER"
unzip "$DB_DUMP_ZIP" -d "./"

# Copy the dump to the Docker container
docker cp "$DB_DUMP_FOLDER" "$CONTAINER_ID:/"

# Import the data to the container
docker exec "$CONTAINER_ID" mongorestore --port $PORT -u $USERNAME -p $PASSWORD "/db-dump/$DB_CONTAINER" --drop

# Cleanup...
echo "⚙️ Finished, deleting db-dump folder..."

if [ $? -eq 0 ]; then
  echo "✅ Import successful. Deleting db-dump folder..."
  rm -r "$DB_DUMP_FOLDER"
else
  echo "❌ Import failed. Keeping db-dump folder for debugging."
fi
