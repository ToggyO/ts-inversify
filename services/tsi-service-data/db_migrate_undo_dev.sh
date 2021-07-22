#/bin/bash
export $(cat ../../.env.development | xargs)
npm run db-migrate:undo
export $(cat ../../clean.env | xargs)
