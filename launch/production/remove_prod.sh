#/bin/bash
export $(cat ../../.env.production | xargs)
docker-compose -f ../../docker-compose.yml down
export $(cat ../../clean.env | xargs)
