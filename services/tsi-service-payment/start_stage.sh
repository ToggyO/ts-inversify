#/bin/bash
export $(cat ../../.env.staging | xargs)
npm run build
npm start
export $(cat ../../clean.env | xargs)
