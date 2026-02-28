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
RUN npm ci --omit=dev && npm install drizzle-kit

COPY --from=build /app/dist ./dist
COPY drizzle.config.ts ./
COPY src/database/schema ./src/database/schema
COPY entrypoint.sh ./

EXPOSE 3100

ENTRYPOINT ["sh", "entrypoint.sh"]
