#/bin/bash
export $(cat ../../.env.development | xargs)
npm run db-migrate
export $(cat ../../clean.env | xargs)
