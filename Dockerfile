FROM node:carbon

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./wait-for-it.sh

EXPOSE 8080