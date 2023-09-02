#!/bin/bash

# Load .env variable properly in docker swarm environment
export $(cat .env) > /dev/null 2>&1; 

yarn install

yarn build

pm2 start pm2.json --node-args='--max-old-space-size=8192' --no-daemon
