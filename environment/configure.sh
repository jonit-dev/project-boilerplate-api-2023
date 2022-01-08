#!/bin/bash

tput setaf 3;  echo "⚙️ Downloading .env files (dev and prod)"
tput setaf 2;
wget -O environment/dev.env "https://www.dropbox.com/s/flkri6m1lj5dk9q/dev.env?dl=1"
wget -O environment/prod.env "https://www.dropbox.com/s/zpz8s0h3i0bg9kv/prod.env?dl=1"

tput setaf 3;  echo "⚙️ Downloading firebase-admin-keyfile.json"
tput setaf 2;

[ ! -d "environment/keys" ] && mkdir environment/keys

wget -O environment/keys/firebase-admin-keyfile.json "https://www.dropbox.com/s/wdd33p2v74osx0d/firebase-admin-keyfile.json?dl=1"

tput setaf 3;  echo "⚙️ Downloading docker-compose.yml files (dev and prod)"
tput setaf 2;
wget -O environment/docker-compose.dev.yml "https://www.dropbox.com/s/cim1wi8mu5afvp7/docker-compose.dev.yml?dl=1"
wget -O environment/docker-compose.prod.yml "https://www.dropbox.com/s/sxlzej878bg5uko/docker-compose.prod.yml?dl=1"

tput setaf 3;  echo "⚙️ Downloading Dockerfiles (dev and prod)"
tput setaf 2;
wget -O environment/Dockerfile.dev "https://www.dropbox.com/s/tmx3yy097crakzo/Dockerfile.dev?dl=1"
wget -O environment/Dockerfile.prod "https://www.dropbox.com/s/h44w0o38glz11y5/Dockerfile.prod?dl=1"

tput setaf 3;  echo "⚙️ Switching env to dev..."
tput setaf 2;
yarn env:switch:dev
