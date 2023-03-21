FROM node:14-alpine

WORKDIR /app

COPY package* ./

RUN npm ci

COPY ./src ./src

ENV NODE_ENV=production

ENTRYPOINT ["node", "src/index.js"]
