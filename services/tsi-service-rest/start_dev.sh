#/bin/bash
export $(cat ../../.env.development | xargs)
npm run dev
export $(cat ../../clean.env | xargs)
