#/bin/bash
export $(cat ../../.env.production | xargs)
docker-compose -f ../../docker-compose.yml stop
export $(cat ../../clean.env | xargs)
