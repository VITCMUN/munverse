FROM node:11

WORKDIR /app

# Required for scripts/wait-for-it.sh
RUN apt -q update && apt -qy install netcat

COPY package*.json ./

RUN npm install

EXPOSE 8080