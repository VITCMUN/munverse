FROM node:11-alpine

WORKDIR /app

COPY . .

RUN npm install --only=production

EXPOSE 8080

CMD ["/app/scripts/wait-for-it.sh", "mongo:27017", "--", "app/scripts/startup.sh"]