# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build
# Build a fully generic image — zero environment variables baked in.
# All runtime config is injected via AWS ECS task environment variables.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the static bundle (no VITE_* vars here — they come from window.env at runtime)
RUN npm run build

# Create a placeholder env.js so the browser never gets a 404 on first load.
# The real values are written by docker-entrypoint.sh when the container starts.
RUN echo "window.env = {};" > /app/dist/env.js

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Serve
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:stable-alpine

# Copy static build output (includes placeholder env.js)
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config: SPA routing + no-cache for env.js so ECS env changes apply immediately
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Entrypoint: overwrites env.js with live ECS environment variables on startup
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8435

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
