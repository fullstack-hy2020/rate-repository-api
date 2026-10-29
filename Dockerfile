FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json .npmrc ./
RUN npm ci --omit=dev \
	&& npm rebuild sqlite3 bcrypt --ignore-scripts=false \
	&& npm cache clean --force

COPY src ./src
COPY migrations ./migrations
COPY seeds ./seeds
COPY knexfile.js ./

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeds ./seeds
COPY --from=builder /app/knexfile.js ./

ENV NODE_ENV=production
ENV APOLLO_PORT=4000
ENV DATABASE_FILENAME=/tmp/database.sqlite

EXPOSE 4000

CMD ["sh", "-c", "./node_modules/.bin/knex migrate:latest && ./node_modules/.bin/knex seed:run && node ./src/index.js"]