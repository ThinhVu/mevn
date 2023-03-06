FROM node:14-alpine as builder
WORKDIR /app
COPY . .
RUN yarn && yarn build

FROM node:14-alpine as runner
WORKDIR .
RUN apk update && apk add bash
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/build ./dist
ENV NODE_ENV=production
ENV API_PORT=4000
EXPOSE 4000
ENTRYPOINT ["/bin/sh", "-c" , "yarn && node ./dist/index.js"]
