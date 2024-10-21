FROM node:20-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
COPY package*.json .
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docs ./docs
CMD ["node", "dist/server.js"]