# Etapa 1: Base de Node y dependencias
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa 2: Servidor de desarrollo (para Docker Compose con Hot Reload)
FROM base AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Etapa 3: Construcción de assets para producción
FROM base AS build
RUN npm run build

# Etapa 4: Servidor de producción con Nginx
FROM nginx:alpine AS prod
# Copiar configuración optimizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiar los archivos construidos de la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
