ARG NODE_VER=16.19.0-alpine3.17

FROM node:${NODE_VER} AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:${NODE_VER} AS builder

ARG ENV_PATH
ENV NODE_ENV production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN find . -type f -name ".env.*" -not -name $ENV_PATH -delete
RUN mv $ENV_PATH .env.local

RUN npm run build
RUN npm prune --omit=dev

FROM node:${NODE_VER}

RUN apk add --no-cache dumb-init openconnect

ENV NODE_ENV production
ARG ENV_PATH
ENV ENV_PATH $ENV_PATH

WORKDIR /app

RUN chown node:node -R /app
COPY vpn_entrypoint /
RUN chmod +x /vpn_entrypoint

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/next.config.js ./
COPY --from=builder --chown=node:node /app/next-i18next.config.js ./
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.env.local ./


USER node

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["/vpn_entrypoint"]

