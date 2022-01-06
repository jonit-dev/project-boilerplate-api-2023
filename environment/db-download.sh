#!/bin/bash

tput setaf 3;  echo "⚙️ Downloading database file. Please wait..."; tput sgr0
tput setaf 2;

[ ! -d "environment/backups" ] && mkdir environment/backups

wget -O environment/backups/db-dump.zip "https://www.dropbox.com/s/zqbbevdhwi7gbbe/db-dump.zip?dl=1"
