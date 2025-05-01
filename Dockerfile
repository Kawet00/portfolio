FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN apk update && apk add npm
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "start"]