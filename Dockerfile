FROM node:14-alpine

WORKDIR /app

COPY Docker/package*.json .
RUN npm install

COPY . . 

CMD ["npm", "start"]
