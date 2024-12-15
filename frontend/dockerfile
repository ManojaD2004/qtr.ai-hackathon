FROM node:18-alpine as base

FROM base AS temp

RUN apk add --no-cache libc6-compat

# Building Stage

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

# Production Stage

FROM base AS runner

WORKDIR /app

COPY --from=temp /app/.next/standalone ./

COPY --from=temp /app/.next/static ./.next/static

COPY --from=temp /app/public ./public

CMD [ "/bin/sh", "-c", "node server.js" ]