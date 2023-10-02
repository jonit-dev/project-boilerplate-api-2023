#!/bin/bash

docker container prune -f
docker image prune -af
docker network prune -f
