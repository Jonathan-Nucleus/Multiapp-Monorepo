FROM node:16-bullseye-slim

ARG commit_hash
ENV COMMIT_HASH=$commit_hash

WORKDIR /server
COPY ./package.json .
RUN yarn add global typescript && \
    yarn install --production && \
    yarn cache clean

COPY . .
CMD ["yarn","prod"]
