# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Declare build-time arguments (passed via --build-arg in CI/CD or docker build)
ARG VITE_KINDE_CLIENT_ID
ARG VITE_KINDE_DOMAIN
ARG VITE_KINDE_REDIRECT_URI
ARG VITE_KINDE_LOGOUT_REDIRECT_URI
ARG VITE_API_BASE_URL
ARG VITE_WS_URL
ARG VITE_KINDE_INSECURE_REFRESH=true

# Expose build args as environment variables so Vite picks them up during build
ENV VITE_KINDE_CLIENT_ID=$VITE_KINDE_CLIENT_ID
ENV VITE_KINDE_DOMAIN=$VITE_KINDE_DOMAIN
ENV VITE_KINDE_REDIRECT_URI=$VITE_KINDE_REDIRECT_URI
ENV VITE_KINDE_LOGOUT_REDIRECT_URI=$VITE_KINDE_LOGOUT_REDIRECT_URI
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_KINDE_INSECURE_REFRESH=$VITE_KINDE_INSECURE_REFRESH

# Build the production bundle (Vite will bake in all VITE_* env vars)
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Serve
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:stable-alpine

# Copy built static assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config (listens on port 8435, SPA routing via try_files)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script (also generates env.js at runtime as a safety net)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8435

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
