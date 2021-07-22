#/bin/bash
export $(cat ../../.env.development | xargs)
npm run db-seed:undo
export $(cat ../../clean.env | xargs)
