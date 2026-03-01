# --- Build stage ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# --- Production stage ---
FROM node:22-alpine AS production

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm install drizzle-orm drizzle-kit

COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle.config.ts ./
COPY --from=build /app/src/database/migrations ./src/database/migrations
COPY entrypoint.sh ./

EXPOSE 3002

ENTRYPOINT ["sh", "entrypoint.sh"]
