#/bin/bash
export $(cat ../../.env.staging | xargs)
npm run db-migrate:undo
export $(cat ../../clean.env | xargs)
