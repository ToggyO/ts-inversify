#/bin/bash
export $(cat ../../.env | xargs)
docker-compose -f ../../docker-compose.test.yml up -d --build
export $(cat ../../clean.env | xargs)
