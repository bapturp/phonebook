FROM node:22-alpine

ARG APP_NAME=phonebook

WORKDIR /usr/src/${APP_NAME}

LABEL maintainer="bapturp"

COPY . .

RUN npm install

EXPOSE 8080

CMD ["node", "index.js"]
