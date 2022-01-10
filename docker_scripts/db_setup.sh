#!/usr/bin/env bash

echo '🪄 MongoDB: Creating application user and db 🪄'

mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);
     
    db.createUser({user: '${MONGO_INITDB_ROOT_USERNAME}', pwd: '${MONGO_INITDB_ROOT_PASSWORD}', roles:[{role:'dbOwner', db: '${MONGO_INITDB_DATABASE}'}]});
EOF
