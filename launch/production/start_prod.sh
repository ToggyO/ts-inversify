#/bin/bash
export $(cat ../../.env.production | xargs)
docker-compose -f ../../docker-compose.yml up --build -d
export $(cat ../../clean.env | xargs)

