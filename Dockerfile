# ============================================
# Dockerfile — Frontend Biro Jasa (React + Vite)
# Build:  docker build --build-arg VITE_API_BASE_URL=... -t bj-ui:production .
# ============================================

# --- STAGE 1: Build ---
FROM node:22-alpine AS build
WORKDIR /app

# Build args (diisi saat docker build, nilai default utk dev)
ARG VITE_API_BASE_URL=http://localhost:3000/api/v1
ARG VITE_GOOGLE_MAPS_KEY=ISI_API_KEY
ARG VITE_WHATSAPP_NUMBER=628xxxxxxxxxx
ARG VITE_MAPS_ORIGIN="Jl Hasan Saban Pancoran Mas Depok"

# Vite membaca env vars berawalan VITE_ saat build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_GOOGLE_MAPS_KEY=$VITE_GOOGLE_MAPS_KEY \
    VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER \
    VITE_MAPS_ORIGIN=$VITE_MAPS_ORIGIN

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# --- STAGE 2: Serve via nginx ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
