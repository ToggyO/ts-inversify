#/bin/bash
export $(cat ../../.env.development | xargs)
docker-compose -f ../../docker-compose.dev.yml up -d --build
export $(cat ../../clean.env | xargs)
