FROM node:18-alpine 

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 

RUN npm run build

RUN npm install -g serve --unsafe-perm

CMD ["serve", "-s", "dist"]

EXPOSE 4173