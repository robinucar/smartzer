# ---------- Base stage ----------
  FROM node:22.18.0-alpine AS base
  WORKDIR /app
  
  # Copy the full monorepo first
  COPY . .
  
  # Install all workspace dependencies
  RUN npm ci
  
  
  # ---------- Build stage ----------
  FROM base AS build
  WORKDIR /app
  
  # Build the backend app 
  RUN npx nx build backend
  
  
  # ---------- Production stage ----------
  FROM node:22.18.0-alpine AS production
  WORKDIR /app
  
  # ✅ Copy built output from custom path
  COPY --from=build /app/backend/dist/ ./dist
  
  COPY --from=build /app/package.json ./
  COPY --from=build /app/node_modules ./node_modules
  
  ENV NODE_ENV=production
  EXPOSE 3333
  
  CMD ["node", "dist/main.js"]
  