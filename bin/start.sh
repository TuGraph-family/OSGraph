#!/bin/bash

cd ./osgraph-service || { echo "Failed to enter osgraph-service directory"; exit 1; }
if [ "$1" = "prod" ]; then
    lsof -ti:8000 | xargs kill -9 || true
    nohup poetry run gunicorn -w 4 -b 0.0.0.0:8000 server:app > gunicorn.log 2>&1 &
    echo "Gunicorn started in production mode."
else
    python ./server.py
fi

