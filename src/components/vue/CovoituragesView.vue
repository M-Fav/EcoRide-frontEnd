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
          <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Liste des résultats -->
    <div class="results">
      <h2 class="results-title">Résultats</h2>
      <div v-if="covoiturages && covoiturages.length > 0" class="covoiturage-cards">
        <div v-for="covoiturage in covoiturages" :key="covoiturage.covoiturageId" class="covoiturage-card"
          :class="{ selected: selectedCovoiturage && selectedCovoiturage.covoiturageId === covoiturage.covoiturageId }"
          @click="selectCovoiturage(covoiturage)">
          <div class="covoiturage-header">
            <span class="icon">🚗</span>
            <strong>{{ covoiturage.lieuDepart }} ➝ {{ covoiturage.lieuArrivee }}</strong>
          </div>
          <div class="covoiturage-details">
            <div class="covoiturage-grid">
              <p><span class="icon">📅</span> <strong>Date : </strong> &nbsp; {{ covoiturage.date }}</p>
              <p><span class="icon">⏰</span> <strong>Heure : </strong> &nbsp; {{ covoiturage.heureDepart[0] }}:{{
                covoiturage.heureDepart[1] }}</p>
              <p><span class="icon">🪑</span> <strong>Places : </strong> &nbsp; {{ covoiturage.nbPlace }}</p>
              <p><span class="icon">💶</span> <strong>Prix : </strong> &nbsp; {{ covoiturage.prixPersonne }} <img
                  src="../../assets/images/leaf.png" class="credit-icon" /></p>
            </div>
            <!-- Bouton Participer intégré dans la carte -->
            <div class="participer-container">
              <button v-if="selectedCovoiturage && selectedCovoiturage.covoiturageId === covoiturage.covoiturageId"
                :class="{ 'participer-btn': true, 'participation-validee': covoiturage.participationValidee }"
                :disabled="covoiturage.participationValidee" @click.stop="participerCovoiturage(covoiturage)">
                <span v-if="!covoiturage.participationValidee">
                  Participer
                </span>
                <span v-if="covoiturage.participationValidee">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-check-circle" viewBox="0 0 16 16">
                    <path
                      d="M12.293 4.293a1 1 0 0 0-1.414 0L7 8.586 4.707 6.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l6-6a1 1 0 0 0 0-1.414z" />
                  </svg> Participe
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-else>Aucun covoiturage trouvé.</p>
    </div>

    <!-- Modal de Création de Covoiturage -->
    <CreerCovoiturageModal v-if="showModal && isCreatingRide" :showModal="showModal" :title="modalTitle"
      @close="showModal = false" @create="handleCreateRide" />

    <!-- Modal de Connexion -->
    <LoginModal v-if="showModal && !isCreatingRide" :showModal="showModal" :title="modalTitle"
      @close="showModal = false" />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import CreerCovoiturageModal from "@/components/modal/CreerCovoiturageModal.vue";
import LoginModal from "@/components/modal/LoginModal.vue";
import { ecorideService } from "@/services/backend-api.js";
import dayjs from "dayjs";

export default {
  components: { CreerCovoiturageModal, LoginModal },
  setup() {
    const showModal = ref(false);
    const isCreatingRide = ref(false);
    const modalTitle = ref("");
    const authStore = useAuthStore();
    const token = computed(() => authStore.token);
    const user = computed(() => authStore.user ?? '');

    // Champs de recherche
    const depart = ref("");
    const destination = ref("");
    const date = ref("");
    const covoiturages = ref([]);
    const selectedCovoiturage = ref(null);

    // Fonction de recherche
    const rechercheCovoiturages = async () => {
      try {
        const credentials = {
          utilisateurId: user.value ? user.value.utilisateurId : "",
          lieuDepart: depart.value,
          lieuArrivee: destination.value,
          date: dayjs(date.value, "YYYY-MM-DD").format("DD-MM-YYYY")
        };

        const data = await ecorideService(credentials, '/covoiturage/covoiturages', 'GET');
        covoiturages.value = Array.isArray(data) ? data : [];
        console.log("Les covoiturages :", data);
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
        covoiturages.value = [];
      }
    };

    // Sélectionner un covoiturage
    const selectCovoiturage = (covoiturage) => {
      selectedCovoiturage.value = covoiturage;
    };

    // Action lorsqu'on clique sur "Participer"
    const participerCovoiturage = async (covoiturage) => {
      try {
        const credentials = {
          validationCovoiturage: false,
          utilisateurId: user.value ? user.value.utilisateurId : "",
          role: "PASSAGER",
          covoiturageId: covoiturage.covoiturageId
        };

        const data = await ecorideService(credentials, "/covoitureur/createCovoitureur", "POST", token.value);
        console.log("Participation réussie:", data);

        // Mettre à jour l'état de la participation dans le covoiturage
        covoiturage.participationValidee = true;

        user.value.credit -= covoiturage.prixPersonne;

      } catch (error) {
        console.error("Erreur lors de la participation :", error);
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
      showModal.value = true;
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
      selectedCovoiturage,
      openModal,
      handleCreateRide,
      searchRides: rechercheCovoiturages,
      selectCovoiturage,
      participerCovoiturage
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

input,
button {
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

.covoiturages-view {
  margin: 0 auto;
  /* Centre la vue */
  padding: 40px;
  /* Augmente l’espace intérieur */
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

/* Style du bouton "Participer" */
.participer-btn {
  background-color: #2c6f2b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.participer-btn:hover {
  background-color: #1d4f1a;
}

/* Style pour la carte de covoiturage */
.covoiturage-card {
  background: #f4f4f4;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Conteneur des détails du covoiturage */
.covoiturage-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Conteneur du bouton "Participer" */
.participer-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Style pour la carte sélectionnée */
.selected {
  border: 2px solid #2c6f2b;
}

/* Style pour le bouton après validation de la participation */
.participation-validee {
  background-color: #28a745;
  display: flex;
  align-items: center;
}

.participation-validee svg {
  margin-right: 8px;
}

.credit-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

@media screen and (max-width: 768px) {
  .search-bar {
    display: flex;
    flex-direction: column;
  }

  .covoiturage-card {
    flex-direction: column;
    padding: 25px;
  }

  .covoiturage-details {
    flex-direction: column;
  }
}
</style>
