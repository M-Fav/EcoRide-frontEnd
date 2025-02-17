<template>
    <div class="user-space">
      <!-- Bloc Gauche : Historique Covoiturage -->
      <div class="history-section">
        <div class="history-cards">
          <!-- Covoiturages en cours -->
          <div class="history-column">
            <h3>Covoiturages en cours</h3>
            <div v-if="user?.historiqueEnCours?.length">
              <div v-for="trip in user?.historiqueEnCours" :key="trip.id" class="history-card">
                <p><strong>Départ :</strong> {{ trip.depart }}</p>
                <p><strong>Arrivée :</strong> {{ trip.arrivee }}</p>
                <p><strong>Date :</strong> {{ trip.date }}</p>
              </div>
            </div>
            <p v-else>Aucun covoiturage en cours.</p>
          </div>

  
          <!-- Covoiturages passés -->
          <div class="history-column">
            <h3>Covoiturages passés</h3>
            <div v-if="user?.historiquePasses?.length">
              <div v-for="trip in user?.historiquePasses" :key="trip.id" class="history-card">
                <p><strong>Départ :</strong> {{ trip.depart }}</p>
                <p><strong>Arrivée :</strong> {{ trip.arrivee }}</p>
                <p><strong>Date :</strong> {{ trip.date }}</p>
              </div>
            </div>
            <p v-else>Aucun covoiturage passé.</p>
          </div>
        </div>
      </div>
  
      <!-- Bloc Droite : Utilisateur & Voitures -->
      <div class="right-section">
        <!-- Bloc Utilisateur -->
        <div class="user-info">
          <img :src="userPhoto" alt="Photo de profil" class="user-photo" />
          <div class="user-details">
            <h2>{{ user?.name }}</h2>
            <p>Email : {{ user?.email }}</p>
            <p>Crédits : <strong>{{ user?.credits }} €</strong></p>
            <button @click="ajouterCredits" class="btn">Alimenter crédits</button>
          </div>
        </div>
  
        <!-- Bloc Voitures -->
        <div class="vehicles-section">
          <h3>Vos voitures enregistrées</h3>
          <ul v-if="user?.voitures?.length">
            <li v-for="voiture in user?.voitures" :key="voiture.id">
              🚗 {{ voiture.marque }} - {{ voiture.modele }} ({{ voiture.annee }})
            </li>
          </ul>
          <p v-else>Aucune voiture enregistrée.</p>
          <button @click="ajouterVoiture" class="btn">Créer une voiture</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { inject } from "vue";
  
  export default {
    name: "UtilisateurView",
    setup() {
      const user = inject("user");
      const userPhoto = inject("userPhoto");
  
      const ajouterCredits = () => alert("Ajout de crédits en cours...");
      const ajouterVoiture = () => alert("Redirection vers la création d'une voiture...");
  
      return {
        user,
        userPhoto,
        ajouterCredits,
        ajouterVoiture,
      };
    },
  };
  </script>
  
  
  <style scoped>
/* Conteneur principal */
.user-space {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 colonnes de taille égale */
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

/* Bloc Gauche : Historique Covoiturage */
.history-section {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.history-cards {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Deux colonnes pour séparer les covoiturages en cours et passés */
  gap: 20px;
  height: 100%;
}

.history-column {
  display: flex;
  flex-direction: column;
}

.history-card {
  background: white;
  padding: 15px;
  margin: 5px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%; /* Utilise toute la largeur disponible dans la colonne */
}

/* Bloc Droite : Utilisateur & Voitures */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

/* Bloc Utilisateur */
.user-info {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;  /* Centre verticalement */
  gap: 20px;  /* Espace entre l'image et les informations */
}

.user-photo {
  width: 80px;  /* Réduit la taille de l'image */
  height: 80px;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 5px;  /* Espace entre les informations */
}

.user-details h2 {
  margin: 0;
}

/* Bloc Voitures */
.vehicles-section {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Boutons */
.btn {
  background: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-history {
  background: #3498db;
}

.btn:hover {
  opacity: 0.8;
  
}

.history-column:first-child {
  position: relative;
}


.history-column:first-child::after {
  content: "";
  position: absolute;
  top: 0;
  right: -10px; /* Place la barre entre les deux colonnes */
  width: 2px;
  height: 100%;
  background-color: #ccc; /* Couleur de la barre */
}
  </style>
  