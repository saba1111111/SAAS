# Dockerfile
FROM node:18.16

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]