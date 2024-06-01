ARG NODE_VER=16.19.0-alpine3.17

FROM node:${NODE_VER} AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:${NODE_VER} AS builder

ARG ENV_PATH
ENV NODE_ENV production
ENV ENV_PATH $ENV_PATH

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm prune --omit=dev

FROM node:${NODE_VER}

RUN apk add --no-cache dumb-init postgresql14-client

ARG ENV_PATH
ENV NODE_ENV production
ENV ENV_PATH $ENV_PATH

WORKDIR /app

RUN chown node:node -R /app

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/config ./config
COPY --from=builder --chown=node:node /app/database ./database
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/src ./src
COPY --from=builder --chown=node:node /app/favicon.png ./
COPY --from=builder --chown=node:node /app/server.js ./
COPY --from=builder --chown=node:node /app/$ENV_PATH ./

RUN mkdir -p /backup/db
RUN chown -R node:node /backup

USER node

EXPOSE 1337

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "server.js"]
