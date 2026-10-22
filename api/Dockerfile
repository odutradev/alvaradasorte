FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i --force
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache wget curl
COPY package*.json ./
RUN npm i --omit=dev --force
COPY --from=builder /app/dist ./dist
EXPOSE 80
CMD ["node", "dist/server.js"]