#!/bin/bash

export $(grep -v '^#' .env | xargs)

yarn start:prod
