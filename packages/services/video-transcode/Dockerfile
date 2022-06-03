FROM node:16-bullseye-slim

ARG commit_hash
ENV COMMIT_HASH=$commit_hash

WORKDIR /server
COPY ./package.json .
RUN npm i
COPY . .
CMD ["node","server.js"]
