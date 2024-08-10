FROM node:21.6.2-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

COPY ./skunk-works/ /skunk-works

RUN cd /skunk-works; \
    npm install; \
    npm run link; \
    cd /usr/src/app; \
    npm link @pubky/sdk;

CMD [ "npm", "run", "start:dev"]
