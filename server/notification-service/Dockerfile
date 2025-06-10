# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

CMD ["node", "dist/services/notification-order-prepared-consumer.js"]