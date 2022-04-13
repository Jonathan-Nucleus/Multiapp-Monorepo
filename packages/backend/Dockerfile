FROM node:16-buster-slim

WORKDIR /server
COPY ./package.json .
RUN yarn add global typescript && \
    yarn install --production && \
    yarn cache clean

COPY . .
CMD ["yarn","prod"]
