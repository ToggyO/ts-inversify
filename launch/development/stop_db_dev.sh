#/bin/bash
export $(cat ../../.env.development | xargs)
docker-compose -f ../../docker-compose.dev.yml down
export $(cat ../../clean.env | xargs)
