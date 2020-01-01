FROM node:11

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 8080