#!/bin/bash

ROOT_FOLDER="$(cd ../ && pwd)"
ABSOLUTE_PATH=${PWD##*/} 
PROJECT_FOLDER="$ROOT_FOLDER/$ABSOLUTE_PATH"
PROD_ENV="$PROJECT_FOLDER/.env"
DB_CONTAINER=$(awk -F'=' '/^MONGO_HOST_CONTAINER/{ print $2}' "$PROD_ENV" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
BACKUPS_FOLDER="$PROJECT_FOLDER/environment/backups"
USERNAME=$(awk -F'=' '/^MONGO_INITDB_ROOT_USERNAME/ { print $2}'  "$PROD_ENV")
PASSWORD=$(awk -F'=' '/^MONGO_INITDB_ROOT_PASSWORD/ { print $2}' "$PROD_ENV")
PORT=$(awk -F'=' '/^MONGO_PORT/ { print $2}' "$PROD_ENV")

[ ! -d "$BACKUPS_FOLDER" ] && echo "/environment/backups folder do not exist! Please, create one before proceeding" && exit

# Make sure there's a db data to import

# Unzip db data 


cd "$BACKUPS_FOLDER"
 
unzip "db-dump.zip" -d "./"
 
docker cp "./db-dump" "$DB_CONTAINER:/" 

cd "$PROJECT_FOLDER" # We should go back to the project root folder to execute docker-compose properly, otherwise an error will occur!

# Import it to container
docker-compose exec $DB_CONTAINER mongorestore -d $DB_CONTAINER --port $PORT -u $USERNAME -p $PASSWORD "./db-dump/$DB_CONTAINER" --drop
 
echo "Finished, deleting db-dump folder..."
rm -r "$BACKUPS_FOLDER/db-dump" 
 
