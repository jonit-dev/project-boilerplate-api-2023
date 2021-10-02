#!/bin/bash

tput setaf 3;  echo "⚙️ Downloading .env files (dev and prod)"
tput setaf 2;
wget -O environment/dev.env "https://www.dropbox.com/s/sw54ku4mnf276pi/dev.env?dl=1"
wget -O environment/prod.env "https://www.dropbox.com/s/fw55kraz81qwn3c/prod.env?dl=1"

tput setaf 3;  echo "⚙️ Downloading firebase-admin-keyfile.json"
tput setaf 2;

[ ! -d "environment/keys" ] && mkdir environment/keys

wget -O environment/keys/firebase-admin-keyfile.json "https://www.dropbox.com/s/wdd33p2v74osx0d/firebase-admin-keyfile.json?dl=1"

tput setaf 3;  echo "⚙️ Downloading docker-compose.yml files (dev and prod)"
tput setaf 2;
wget -O environment/docker-compose.dev.yml "https://www.dropbox.com/s/ynf9twl1xfktgf0/docker-compose.dev.yml?dl=1"
wget -O environment/docker-compose.prod.yml "https://www.dropbox.com/s/ehcx9g3swu5j9pm/docker-compose.prod.yml?dl=1"

tput setaf 3;  echo "⚙️ Downloading Dockerfiles (dev and prod)"
tput setaf 2;
wget -O environment/Dockerfile.dev "https://www.dropbox.com/s/t3qtfkjicb2wysr/Dockerfile.dev?dl=1"
wget -O environment/Dockerfile.prod "https://www.dropbox.com/s/eo2jbilermw6453/Dockerfile.prod?dl=1"

tput setaf 3;  echo "⚙️ Switching env to dev..."
tput setaf 2;
yarn env:switch:dev
