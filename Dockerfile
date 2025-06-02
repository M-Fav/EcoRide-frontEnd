# Utilise une image officielle Node.js
FROM node:20

# Crée un dossier de travail
WORKDIR /app

# Copie les fichiers de configuration
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie tout le reste (src, public, etc.)
COPY . .

# Exposition du port utilisé par Vue (par défaut 8080)
EXPOSE 8081

# Lance le serveur de développement
CMD ["npm", "run", "serve"]
