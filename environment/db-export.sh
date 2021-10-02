#!/bin/bash
ROOT_FOLDER="$(cd ../ && pwd)"
ABSOLUTE_PATH=${PWD##*/} 
PROJECT_FOLDER="$ROOT_FOLDER/$ABSOLUTE_PATH"
PROD_ENV="$PROJECT_FOLDER/.env"
DB_CONTAINER=$(awk -F'=' '/^MONGO_HOST_CONTAINER/{ print $2}' "$PROD_ENV" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
BACKUPS_FOLDER="./environment/backups"
BACKUP_FILE="$BACKUPS_FOLDER/db-dump.zip"

[ ! -d "$BACKUPS_FOLDER" ] && echo "/environment/backups folder do not exist! Please, create one before proceeding" && exit


echo "Loading production .env from ${PROD_ENV}"

# Fetch mongodb username and password, so we can dump our data into a file
USERNAME=$(awk -F'=' '/^MONGO_INITDB_ROOT_USERNAME/ { print $2}'  "$PROD_ENV")
PASSWORD=$(awk -F'=' '/^MONGO_INITDB_ROOT_PASSWORD/ { print $2}' "$PROD_ENV")

# Execute dump command to export db files to mongo container
docker-compose exec "$DB_CONTAINER" mongodump -u ${USERNAME} -p ${PASSWORD}  -o /db-dump/

# then we copy these files (under dump folder) to our host

mkdir "$BACKUPS_FOLDER"

docker cp "$DB_CONTAINER:/db-dump" "$BACKUPS_FOLDER/db-dump"

cd "$BACKUPS_FOLDER"

zip -r "db-dump.zip" "./db-dump"

chmod 755 "./db-dump.zip"

# Lets do some cleanup, so we don't mess up our importing later
echo "Finished, deleting db-dump folder..."
rm -rf "./db-dump"
