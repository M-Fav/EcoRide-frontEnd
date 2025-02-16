<template>
  <div class="covoiturages-view">
    <h1>Rechercher un covoiturage</h1>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input 
        type="text" 
        v-model="depart" 
        placeholder="Lieu de départ" 
      />
      <input 
        type="text" 
        v-model="destination" 
        placeholder="Destination" 
      />
      <input 
        type="date" 
        v-model="date" 
      />
      <button @click="searchRides">Rechercher</button>
      <button class="create-btn" @click="showModal = true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Liste des résultats -->
    <div class="results">
      <h2 class="results-title">Résultats</h2>
      <div v-if="covoiturages && covoiturages.length > 0" class="covoiturage-cards">
        <div v-for="covoiturage in covoiturages" :key="covoiturage.covoiturageId" class="covoiturage-card">
          <div class="covoiturage-header">
            <span class="icon">🚗</span>
            <strong>{{ covoiturage.lieuDepart }} ➝ {{ covoiturage.lieuArrivee }}</strong>
          </div>
          <div class="covoiturage-details">
            <div class="covoiturage-grid">
              <p><span class="icon">📅</span> <strong>Date:</strong> {{ covoiturage.date }}</p>
              <p><span class="icon">⏰</span> <strong>Heure:</strong> {{ covoiturage.heureDepart[0] }}:{{ covoiturage.heureDepart[1] }}</p>
              <p><span class="icon">⏳</span> <strong>Durée:</strong> {{ covoiturage.duree[0] }}h {{ covoiturage.duree[1] }}m</p>
              <p><span class="icon">🪑</span> <strong>Places:</strong> {{ covoiturage.nbPlace }}</p>
              <p><span class="icon">💶</span> <strong>Prix:</strong> {{ covoiturage.prixPersonne }} €</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else>Aucun covoiturage trouvé.</p>
    </div>

    <!-- Modal de création -->
    <CreerCovoiturageModal :showModal="showModal" @close="showModal = false" @create="handleCreateRide" />
  </div>
</template>

<script>
import { ref } from "vue";
import dayjs from "dayjs";
import { openBankingService } from "@/services/backend-api.js";
import CreerCovoiturageModal from "@/components/modal/CreerCovoiturageModal.vue";

export default {
  components: {
    CreerCovoiturageModal,
  },
  setup() {
    // Champs de recherche
    const depart = ref("");
    const destination = ref("");
    const date = ref("");
    const covoiturages = ref([]);
    const showModal = ref(false);
    const isLoading = ref(false); // Loader

    // Fonction de recherche
    const rechercheCovoiturages = async () => {
      isLoading.value = true;
      try {
        const credentials = { 
          lieuDepart: depart.value, 
          lieuArrivee: destination.value, 
          date: dayjs(date.value, "YYYY-MM-DD").format("YYYY-MM-DD")
        };
        
        const data = await openBankingService(credentials, '/covoiturage/covoiturages', 'GET');

        covoiturages.value = Array.isArray(data) ? data : [];
        console.log("Les covoiturages :", data);
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
        covoiturages.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // Gestion de la création d'un covoiturage
    const handleCreateRide = (ride) => {
      console.log("Nouveau covoiturage créé :", ride);
      showModal.value = false;
      // Ici, tu peux envoyer les données à l'API
    };

    return {
      depart,
      destination,
      date,
      covoiturages,
      searchRides: rechercheCovoiturages,
      showModal,
      handleCreateRide,
      isLoading,
    };
  },
};
</script>

<style scoped>
.covoiturages-view {
  text-align: center;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

input, button {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #385C05;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #22963d;
}

.results {
  margin-top: 20px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.results-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.covoiturage-card {
  background: #f4f4f4;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
}

.covoiturage-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  align-items: center;
}

.covoiturage-details p {
  margin: 0;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 8px;
}

.create-btn {
  background-color: #385C05;
  color: white;
  font-size: 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-btn:hover {
  background-color: #22963d;
}
</style>
