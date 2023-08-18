#!/bin/bash

export $(cat .env) > /dev/null 2>&1; 

yarn start:prod
