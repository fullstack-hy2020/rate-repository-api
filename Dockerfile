FROM registry.access.redhat.com/ubi9/nodejs-22 AS builder

USER 0
WORKDIR /app

RUN dnf install -y python3 make gcc-c++ \
	&& dnf clean all \
	&& rm -rf /var/cache/dnf

COPY package*.json ./
RUN npm ci --omit=dev \
	&& npm cache clean --force

COPY src ./src
COPY migrations ./migrations
COPY seeds ./seeds
COPY knexfile.js ./

FROM registry.access.redhat.com/ubi9/nodejs-22-minimal

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