#/bin/bash
export $(cat ../../.env.staging | xargs)
docker-compose -f ../../docker-compose.stage.yml up --build -d
export $(cat ../../clean.env | xargs)
