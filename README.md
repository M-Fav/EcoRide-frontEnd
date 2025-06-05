# 🚀 Installation de l'environnement local

## 🛠️ Prérequis
- Installer **Docker Desktop** 🐳

## 📝 Étapes d'installation

1. 📂 Se placer à la racine du projet :  
   cd /chemin/vers/le/projet

2. 🏗️ Construire l'image Docker :
    ```bash
   docker build -t ecoride-front .

3. ▶️ Lancer le container Docker :
   ```bash
   docker run -d -p 8081:8081 --name ecoride-front ecoride-front

4. 🌐 Accéder à l'application via :
   * Le localhost indiqué dans les logs de la console 🖥️
   * Ou via l'interface de Docker Desktop 🐳
