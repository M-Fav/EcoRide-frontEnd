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
          <div v-if="isLoading" class="loader-container">
            <div class="loader"></div>
          </div>
          
          <div v-else-if="voitures.length" class="car-list">
            <div v-for="voiture in voitures" :key="voiture.id" class="car-card">
              <div class="car-icon">🚗</div>
              <div class="car-details">
                <h4>{{ voiture.marque }} - {{ voiture.modele }}</h4>
                <p>Année : {{ new Date(voiture.datePremiereImmatriculation).getFullYear() }}</p>
                <p>Couleur : {{ voiture.couleur }}</p>
              </div>
            </div>
          </div>
  
          <p v-else>Aucune voiture enregistrée.</p>
          <button @click="openCreateCarModal" class="btn">Créer une voiture</button>
        </div>
      </div>
    </div>
  
    <!-- Modale pour créer une voiture -->
    <CreerVoitureModal 
      :showModal="showCreerVoitureModal" 
      @close="closeCreateCarModal"
      @carCreated="fetchVoitures" 
    />
  </template>
  
  <script>
  import { ref, inject, onMounted } from "vue";
  import { ecorideService } from "@/services/backend-api.js";
  import { useAuthStore } from "@/stores/authStore";
  import CreerVoitureModal from "../modal/CreerVoitureModal.vue";
  
  export default {
    name: "UtilisateurView",
    components: {
      CreerVoitureModal,
    },
    setup() {
      const user = inject("user");
      const userPhoto = inject("userPhoto");
      const authStore = useAuthStore();
      const token = authStore.token;
      const utilisateurId = authStore.user.utilisateurId;
  
      const voitures = ref([]);
      const isLoading = ref(false);
      const showCreerVoitureModal = ref(false);
  
      // Récupération des voitures
      const fetchVoitures = async () => {
        isLoading.value = true;
        try {
          const data = await ecorideService(
            { utilisateurId },
            "/voitures/recupererVoituresUtilisateur",
            "GET",
            token
          );
          voitures.value = data;
        } catch (error) {
          console.error("Erreur lors de la récupération des voitures :", error);
        } finally {
          isLoading.value = false;
        }
      };
  
      onMounted(fetchVoitures);
  
      const ajouterCredits = () => alert("Ajout de crédits en cours...");
      
      const openCreateCarModal = () => {
        showCreerVoitureModal.value = true;
      };
  
      const closeCreateCarModal = () => {
        showCreerVoitureModal.value = false;
      };
  
      return {
        user,
        userPhoto,
        voitures,
        isLoading,
        showCreerVoitureModal,
        openCreateCarModal,
        closeCreateCarModal,
        fetchVoitures,
        ajouterCredits,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Conteneur principal */
  .user-space {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    height: 100%;
  }
  
  .history-column {
    display: flex;
    flex-direction: column;
  }
  
  .history-column:first-child {
    position: relative;
  }
  
  .history-column:first-child::after {
    content: "";
    position: absolute;
    top: 0;
    right: -10px; 
    width: 2px;
    height: 100%;
    background-color: #385C05;
  }
  
  .history-card {
    background: white;
    padding: 15px;
    margin: 5px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Bloc Droite : Utilisateur & Voitures */
  .right-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* Bloc Utilisateur */
  .user-info {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  /* Bloc Voitures */
  .vehicles-section {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Liste des voitures en grid */
  .car-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Centre les éléments horizontalement */
    gap: 15px;
  }
  
  .car-card {
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .car-icon {
    font-size: 30px;
  }
  
  .car-details h4 {
    margin: 0;
    font-size: 16px;
  }
  
  .car-details p {
    margin: 5px 0;
    font-size: 14px;
    color: #555;
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
  
  .btn:hover {
    opacity: 0.8;
  }
  </style>
  