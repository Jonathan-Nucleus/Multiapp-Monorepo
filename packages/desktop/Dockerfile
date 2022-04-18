FROM node:16-bullseye-slim as build
WORKDIR /server
COPY ./package.json .
RUN yarn build

FROM node:16-bullseye-slim
EXPOSE 3000
WORKDIR /server
COPY ./package.json .
RUN yarn add global typescript && \
    yarn install --production && \
    yarn cache clean

COPY . .
CMD ["yarn","start"]
