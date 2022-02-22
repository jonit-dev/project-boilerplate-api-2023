#!/bin/bash

# Environment files download

tput setaf 3;  echo "⚙️ Downloading .env files (dev and prod)"
tput setaf 2;
wget -O environment/dev.env "https://www.dropbox.com/s/xhcq406vzznno83/dev.env?dl=1"
wget -O environment/prod.env "https://www.dropbox.com/s/2hv22144indk4m2/prod.env?dl=1"

tput setaf 3;  echo "⚙️ Downloading firebase-admin-keyfile.json"
tput setaf 2;

[ ! -d "environment/keys" ] && mkdir environment/keys

wget -O environment/keys/firebase-admin-keyfile.json "https://www.dropbox.com/s/cecosts5h6mzxvw/firebase-admin-keyfile.json?dl=1"

tput setaf 3;  echo "⚙️ Downloading docker-compose.yml files (dev and prod)"
tput setaf 2;
wget -O environment/docker-compose.dev.yml "https://www.dropbox.com/s/hm79rfthbpw4kh6/docker-compose.dev.yml?dl=1"
wget -O environment/docker-compose.prod.yml "https://www.dropbox.com/s/21hp5fsp3g3c8v8/docker-compose.prod.yml?dl=1"

tput setaf 3;  echo "⚙️ Downloading Dockerfiles (dev and prod)"
tput setaf 2;
wget -O environment/Dockerfile.dev "https://www.dropbox.com/s/18a2nnr0w3opz8g/Dockerfile.dev?dl=1"
wget -O environment/Dockerfile.prod "https://www.dropbox.com/s/2sdwscki70rewoc/Dockerfile.prod?dl=1"


tput setaf 3;  echo "⚙️ Switching env to dev..."
tput setaf 2;
yarn env:switch:dev
