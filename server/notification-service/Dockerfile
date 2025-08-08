# Base image
FROM node:18 AS builder

WORKDIR /app


COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

CMD ["node", "dist/services/notification-order-prepared-consumer.js"]


FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# copy any runtime assets needed by your service here, e.g.
# COPY src/services/firebase-service-account.json ./dist/services/firebase-service-account.json
CMD ["node", "dist/index.js"]