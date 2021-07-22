FROM node:14.11.0
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --silent --production
COPY ./ ./
RUN npm run build
CMD npm start