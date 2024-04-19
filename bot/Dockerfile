FROM node:18.17-slim

RUN apt-get update
RUN apt-get install

WORKDIR /app
COPY package*.json /app/
COPY node_modules /app/node_modules
COPY src /app/src
