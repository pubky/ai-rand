FROM node:21.6.2-slim as builder

RUN corepack enable

WORKDIR /usr/src/app

ENV NODE_PATH=/usr/src/app/node_modules

COPY . .

RUN npm install

COPY ./skunk-works/ /skunk-works

RUN cd /skunk-works; \
    npm install; \
    npm run link; \
    cd /usr/src/app; \
    npm link @pubky/sdk;

FROM node:21.6.2-slim as final

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app

CMD [ "npm", "run", "start:dev"]
