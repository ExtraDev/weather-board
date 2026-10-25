# ===== Étape 1 : Build Angular =====
FROM node:22-alpine AS build

WORKDIR /app

# Copier les fichiers nécessaires à l’installation
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Builder l’application Angular (dossier dist/)
RUN npm run build --prod

# ===== Étape 2 : Serveur Nginx =====
FROM nginx:stable-alpine

# Copier les fichiers compilés dans le dossier HTML de Nginx
COPY --from=build /app/dist/weather-board/browser/ /usr/share/nginx/html

# Exposer le port: 80
EXPOSE 80

# Lancer Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]