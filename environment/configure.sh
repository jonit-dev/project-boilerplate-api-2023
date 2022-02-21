#!/bin/bash

# Environment files download

tput setaf 3;  echo "⚙️ Downloading .env files (dev and prod)"
tput setaf 2;
wget -O environment/dev.env "https://www.dropbox.com/s/54wiadzt68dslos/dev.env?dl=1"
wget -O environment/prod.env "https://www.dropbox.com/s/h1rlrq0tl7jx1tw/prod.env?dl=1"

tput setaf 3;  echo "⚙️ Downloading firebase-admin-keyfile.json"
tput setaf 2;

[ ! -d "environment/keys" ] && mkdir environment/keys

wget -O environment/keys/firebase-admin-keyfile.json "https://www.dropbox.com/s/cecosts5h6mzxvw/firebase-admin-keyfile.json?dl=1"

tput setaf 3;  echo "⚙️ Downloading docker-compose.yml files (dev and prod)"
tput setaf 2;
wget -O environment/docker-compose.dev.yml "https://www.dropbox.com/s/r6s41roy8gw9531/docker-compose.dev.yml?dl=1"
wget -O environment/docker-compose.prod.yml "https://www.dropbox.com/s/rynojcnzxhdmjbp/docker-compose.prod.yml?dl=1"

tput setaf 3;  echo "⚙️ Downloading Dockerfiles (dev and prod)"
tput setaf 2;
wget -O environment/Dockerfile.dev "https://www.dropbox.com/s/qjryqbvzpnskry7/Dockerfile.dev?dl=1"
wget -O environment/Dockerfile.prod "https://www.dropbox.com/s/jyp1nc1xmkpf23w/Dockerfile.prod?dl=1"


tput setaf 3;  echo "⚙️ Downloading socket files"
tput setaf 2;
wget -O environment/Dockerfile.socket.dev "https://www.dropbox.com/s/vt490fpuelxhexi/Dockerfile.socket.dev?dl=1"
wget -O environment/Dockerfile.socket.prod "https://www.dropbox.com/s/0xn0ias6zq786aa/Dockerfile.socket.prod?dl=1"
wget -O environment/socket.env "https://www.dropbox.com/s/hc4nhyp74x83f6a/socket.env?dl=1"






tput setaf 3;  echo "⚙️ Switching env to dev..."
tput setaf 2;
yarn env:switch:dev
