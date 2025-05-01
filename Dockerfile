FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN apk update && apk add npm
RUN npm install
COPY . .
RUN vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

EXPOSE 5000
CMD ["npm", "run", "start"]