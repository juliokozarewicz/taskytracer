#!/bin/bash

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
  rm "$ENV_FILE"
fi

cp ../01_nginx/.env "$ENV_FILE"

sudo docker-compose up --build
