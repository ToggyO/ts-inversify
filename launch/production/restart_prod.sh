#/bin/bash
export $(cat ../../.env.production | xargs)
docker-compose -f ../../docker-compose.yml up -d --build
docker rmi $(docker images -f "dangling=true" -q)
export $(cat ../../clean.env | xargs)

