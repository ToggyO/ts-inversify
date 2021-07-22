#/bin/bash
export $(cat ../../.env.staging | xargs)
docker-compose -f ../../docker-compose.stage.yml stop
export $(cat ../../clean.env | xargs)
