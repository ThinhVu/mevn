FROM node:14-alpine as builder
COPY . .
RUN yarn && yarn build

FROM node:14-alpine as runner
COPY --from=builder ./dist ./
RUN yarn global add serve
ENV PORT=3000
ENTRYPOINT ["/bin/sh", "-c" , "npm i -g spa-serve && spa-serve -p 3000"]

