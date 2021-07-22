#/bin/bash
export $(cat ../../.env.staging | xargs)
docker-compose -f ../../docker-compose.stage.yml up -d --build
docker rmi $(docker images -f "dangling=true" -q)
export $(cat ../../clean.env | xargs)

