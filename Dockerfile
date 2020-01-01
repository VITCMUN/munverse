ARG VERSION=carbon
FROM node:${VERSION}

WORKDIR /app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "development" ]; \
	then npm install;  \
	else npm install --only=production; \
	fi

COPY . .

RUN chmod +x ./wait-for-it.sh

EXPOSE 8080