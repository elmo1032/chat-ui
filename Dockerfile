# syntax=docker/dockerfile:1

# This is a Dockerfile that uses the Node.js 20 version as the base image for production.
# It is split into multiple stages to minimize the final image size and improve build caching.

# The first stage, 'builder-production', installs the dependencies and builds the application.
FROM node:20 as builder-production

# Sets the working directory to /app
WORKDIR /app

# Copies package-lock.json and package.json to the working directory
COPY --link --chown=1000 package-lock.json package.json ./

# Installs the dependencies and builds the application, caching the npm cache for faster subsequent builds
RUN --mount=type=cache,target=/app/.npm \
    npm set cache /app/.npm && \
    npm ci --omit=dev

# The second stage, 'builder', reuses the 'builder-production' stage to install the dependencies
FROM builder-production as build

# Installs the dependencies, reusing the npm cache from the previous stage
RUN --mount=type=cache,target=/app/.npm \
    npm set cache /app/.npm && \
    npm ci

# Copies the application code to the working directory
COPY --link --chown=1000 . .

# Sets the environment variables from the .local file as a secret
RUN --mount=type=secret,id=DOTENV_LOCAL,dst=.env,.local \
    npm run build

# The third stage, 'runtime', uses the Node.js 20 slim version as the base image for runtime.
FROM node:20-slim

# Installs pm2, a production process manager for Node.js
RUN npm install -g pm2

# Copies the node_modules and build directories from the 'builder-production' stage
COPY --from=builder-production /app/node_modules /app/node_modules
COPY --link --chown=1000 package.json /app/package.json
COPY --from=builder /app/build /
