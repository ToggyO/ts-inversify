#/bin/bash
export $(cat ../../.env.staging | xargs)
npm run db-migrate
export $(cat ../../clean.env | xargs)
