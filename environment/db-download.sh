#!/bin/bash

# define variables for VPS and backup file locations
VPS_HOST="europe-ssh.definya.com"
VPS_USER="jonit"
BACKUP_PATH="/home/jonit/rpg-engine/rpg-api/environment/backups/db-dump.zip"
LOCAL_DOWNLOAD_DIR="./environment/backups"
LOCAL_DOWNLOAD_PATH="$LOCAL_DOWNLOAD_DIR/db-dump.zip"

# create the local backups directory if it doesn't already exist
mkdir -p "$LOCAL_DOWNLOAD_DIR"

# download the backup file using scp
scp "$VPS_USER@$VPS_HOST:$BACKUP_PATH" "$LOCAL_DOWNLOAD_PATH"
