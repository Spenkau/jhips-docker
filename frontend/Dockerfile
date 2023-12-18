FROM node:20.0-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build
EXPOSE 9000

CMD ["npm", "start"]
