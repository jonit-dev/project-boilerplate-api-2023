#!/bin/bash

echo "💡 Creating docker network and installing required some project dependencies..."

docker network create v8-network

sudo apt-get install wget -y 

yarn bootstrap
