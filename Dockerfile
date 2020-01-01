ARG VERSION=carbon
FROM node:${VERSION}

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV=development

RUN if [ ${NODE_ENV} = "development" ]; \
	then npm install;  \
	else npm install --only=production; \
	fi

EXPOSE 8080