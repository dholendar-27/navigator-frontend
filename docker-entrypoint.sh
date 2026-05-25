#!/bin/sh
set -e

echo "[entrypoint] Starting navigator-frontend container..."

# Generate /usr/share/nginx/html/env.js so the browser can read
# runtime environment variables even if they were not set at build time.
# This is a safety net — the Vite build already bakes in build-time ARGs.
ENV_JS="/usr/share/nginx/html/env.js"

cat > "$ENV_JS" <<EOF
window.env = {
  VITE_KINDE_CLIENT_ID: "${VITE_KINDE_CLIENT_ID}",
  VITE_KINDE_DOMAIN: "${VITE_KINDE_DOMAIN}",
  VITE_KINDE_REDIRECT_URI: "${VITE_KINDE_REDIRECT_URI}",
  VITE_KINDE_LOGOUT_REDIRECT_URI: "${VITE_KINDE_LOGOUT_REDIRECT_URI}",
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}",
  VITE_WS_URL: "${VITE_WS_URL}",
  VITE_KINDE_INSECURE_REFRESH: "${VITE_KINDE_INSECURE_REFRESH}"
};
EOF

echo "[entrypoint] env.js written to $ENV_JS"
echo "[entrypoint] VITE_KINDE_DOMAIN=${VITE_KINDE_DOMAIN}"
echo "[entrypoint] VITE_API_BASE_URL=${VITE_API_BASE_URL}"
echo "[entrypoint] VITE_KINDE_REDIRECT_URI=${VITE_KINDE_REDIRECT_URI}"

echo "[entrypoint] Handing off to: $@"
exec "$@"
