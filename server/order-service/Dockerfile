FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# CMD ["node", "dist/services/order-queue-producer.js"]

CMD ["node", "dist/index.js"]
