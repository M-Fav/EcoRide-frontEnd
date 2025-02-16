<template>
  <div class="covoiturages-view">
    <h1>Rechercher un covoiturage</h1>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input type="text" v-model="depart" placeholder="Lieu de départ" />
      <input type="text" v-model="destination" placeholder="Destination" />
      <input type="date" v-model="date" />
      <button @click="searchRides">Rechercher</button>
      <button class="create-btn" @click="openModal">
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
              <p><span class="icon">🪑</span> <strong>Places:</strong> {{ covoiturage.nbPlace }}</p>
              <p><span class="icon">💶</span> <strong>Prix:</strong> {{ covoiturage.prixPersonne }} €</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else>Aucun covoiturage trouvé.</p>
    </div>

    <!-- Modal de Création de Covoiturage -->
    <CreerCovoiturageModal
      v-if="showModal && isCreatingRide"
      :showModal="showModal"
      :title="modalTitle"
      @close="showModal = false" 
      @create="handleCreateRide"
    />

    <!-- Modal de Connexion -->
    <LoginModal
      v-if="showModal && !isCreatingRide"
      :showModal="showModal"
      :title="modalTitle"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import CreerCovoiturageModal from "@/components/modal/CreerCovoiturageModal.vue";
import LoginModal from "@/components/modal/LoginModal.vue";
import { openBankingService } from "@/services/backend-api.js";
import dayjs from "dayjs";


export default {
  components: { CreerCovoiturageModal, LoginModal },
  setup() {
    const showModal = ref(false);
    const isCreatingRide = ref(false); 
    const modalTitle = ref("");
    const authStore = useAuthStore();

        // Champs de recherche
    const depart = ref("");
    const destination = ref("");
    const date = ref("");
    const covoiturages = ref([]);
    // Fonction de recherche
    const rechercheCovoiturages = async () => {
      try {
        const credentials = { 
          lieuDepart: depart.value, 
          lieuArrivee: destination.value, 
          date: dayjs(date.value, "YYYY-MM-DD").format("DD-MM-YYYY")
        };
        
        const data = await openBankingService(credentials, '/covoiturage/covoiturages', 'GET');
        covoiturages.value = Array.isArray(data) ? data : [];
        console.log("Les covoiturages :", data);
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
        covoiturages.value = [];
      }
    };

    const openModal = () => {
      if (authStore.isAuthenticated) {
        isCreatingRide.value = true;
        modalTitle.value = "Créer un covoiturage";
      } else {
        isCreatingRide.value = false;
        modalTitle.value = "Veuillez vous connecter";
      }
      showModal.value = true;  // Afficher la modal
    };

    const handleCreateRide = (ride) => {
      console.log("Nouveau covoiturage créé :", ride);
      showModal.value = false;
    };

    return {
      showModal,
      isCreatingRide,
      modalTitle,
      depart,
      destination,
      date,
      covoiturages,
      openModal,
      handleCreateRide,
      searchRides: rechercheCovoiturages,
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
