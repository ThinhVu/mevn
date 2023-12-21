# Stage 1: Build Stage
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install pnpm -g
RUN pnpm install

# Copy the rest of the app's source code
COPY . .

# Build
RUN npm run build

# Stage 2: Runtime Stage
FROM node:18-alpine as runner

# Set the working directory
WORKDIR /app

# add bash
RUN apk update && apk add bash

# Set production env
ENV NODE_ENV=production

# Copy only the necessary artifacts from the build stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/build ./dist
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

# Install production dependencies only
RUN npm install pnpm -g
RUN pnpm install --prod

# Expose the necessary port(s) for your app
ENV API_PORT=4000
EXPOSE 4000

# Start the Node.js application
ENTRYPOINT ["/bin/sh", "-c" , "node ./dist/index.js"]
