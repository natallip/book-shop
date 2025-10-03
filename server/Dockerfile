FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
