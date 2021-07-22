#/bin/bash
export $(cat ../../.env.development | xargs)
npm run db-seed
export $(cat ../../clean.env | xargs)
