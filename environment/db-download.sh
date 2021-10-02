#!/bin/bash

tput setaf 3;  echo "⚙️ Downloading database file"
tput setaf 2;

[ ! -d "environment/backups" ] && mkdir environment/backups

wget -O environment/backups/db-dump.zip "DROPBOX_LINK_HERE"
