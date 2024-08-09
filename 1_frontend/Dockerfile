FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

# RUN npm run build

ENTRYPOINT npm run start:dev