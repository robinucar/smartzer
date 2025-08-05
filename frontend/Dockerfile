# ---------- Base stage ----------
  FROM node:22.18.0-alpine AS base
  WORKDIR /app
  
  # Copy full monorepo early to support workspaces
  COPY . .
  
  # Install all dependencies
  RUN npm ci
  
  
  # ---------- Build stage ----------
  FROM base AS build
  WORKDIR /app
  
  # Build the frontend project
  RUN npx nx build frontend
  
  
  # ---------- Production stage ----------
  FROM nginx:stable-alpine AS production
  WORKDIR /usr/share/nginx/html
  
  # Clean default nginx static files
  RUN rm -rf ./*
  
  # Copy only the frontend's dist output
  COPY --from=build /app/frontend/dist/ ./
  
  EXPOSE 80
  
  CMD ["nginx", "-g", "daemon off;"]
  