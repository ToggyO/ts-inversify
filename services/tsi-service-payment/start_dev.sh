#/bin/bash
export $(cat ../../.env.development | xargs)
export DEBUG=true
npm run dev
export $(cat ../../clean.env | xargs)
