<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <hr class="modal-divider">

      <form @submit.prevent="createRide">
        <div class="form-grid">
          <div>
            <label for="depart">Lieu de départ</label>
            <input id="depart" type="text" v-model="lieuDepart" placeholder="Lieu de départ" required />
          </div>
          <div>
            <label for="destination">Destination</label>
            <input id="destination" type="text" v-model="lieuArrivee" placeholder="Destination" required />
          </div>
          <div>
            <label for="date">Date</label>
            <input id="date" type="date" v-model="date" required />
          </div>
          <div>
            <label for="heure">Heure</label>
            <input id="heure" type="time" v-model="heureDepart" required />
          </div>
          <div>
            <label for="places">Nombre de places</label>
            <input id="places" type="number" v-model="nbPlace" placeholder="Nombre de places" required />
          </div>
          <div>
            <label for="prix">Prix par personne</label>
            <input id="prix" type="number" v-model="prixPersonne" placeholder="Prix par personne (€)" required />
          </div>
        </div>

        <!-- Sélection d'une voiture -->
        <div class="voiture-selection">
          <h3 class="voiture-title">Choisir une voiture</h3>

          <div v-if="isLoading" class="loader-container">
            <div class="loader"></div>
          </div>

          <div v-else>
            <div v-if="voitures.length === 0" class="no-voiture">
              <p>Aucune voiture enregistrée.</p>
              <button @click="openCreateCarModal" class="btn-vert">Créer une voiture</button>
            </div>

            <div v-else class="voiture-cards">
              <div v-for="voiture in voitures" :key="voiture.voitureId" class="voiture-card"
                :class="{ selected: selectedVoitureId === voiture.voitureId }"
                @click="selectedVoitureId = voiture.voitureId">
                <h4>{{ voiture.marque }} - {{ voiture.modele }}</h4>
                <p><strong>Immatriculation:</strong> {{ voiture.immatriculation }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn-vert btn-creer-width">Créer</button>
          <button type="button" class="btn-rouge btn-close-position" @click="closeModal">Annuler</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modale pour créer une voiture -->
  <CreerVoitureModal :showModal="showCreerVoitureModal" @close="closeCreateCarModal" @carCreated="fetchVoitures" />
</template>

<script>
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { ecorideService } from "@/services/backend-api.js";
import { useAuthStore } from "@/stores/authStore";
import CreerVoitureModal from "./CreerVoitureModal.vue";

export default {
  components: {
    CreerVoitureModal,
  },
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const token = computed(() => authStore.token);
    const utilisateurId = computed(() => authStore.user.utilisateurId);

    // Champs du formulaire
    const lieuDepart = ref("");
    const lieuArrivee = ref("");
    const date = ref("");
    const heureDepart = ref("");
    const nbPlace = ref("");
    const prixPersonne = ref("");
    const selectedVoitureId = ref(null);

    // Liste des voitures & état de chargement
    const voitures = ref([]);
    const isLoading = ref(false);

    // Contrôler l'affichage de la modale de création de voiture
    const showCreerVoitureModal = ref(false);

    // Méthode pour ouvrir la modale de création de voiture
    const openCreateCarModal = () => {
      showCreerVoitureModal.value = true;
    };

    // Méthode pour fermer la modale de création de voiture
    const closeCreateCarModal = () => {
      showCreerVoitureModal.value = false;
    };

    // Récupérer les voitures de l'utilisateur avec un loader
    const fetchVoitures = async () => {
      isLoading.value = true;
      try {
        const credentialsVoitures = { utilisateurId: utilisateurId.value };
        const data = await ecorideService(credentialsVoitures, "/voitures/recupererVoituresUtilisateur", "GET", token.value);
        voitures.value = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchVoitures);  // Appel initial pour récupérer les voitures à l'ouverture du composant

    // Fonction pour fermer la modale principale
    const closeModal = () => {
      emit("close");
    };

    // Fonction pour créer un covoiturage
    const createRide = async () => {
      try {
        const credentials = {
          lieuDepart: lieuDepart.value,
          lieuArrivee: lieuArrivee.value,
          utilisateurId: utilisateurId.value,
          date: dayjs(date.value, "YYYY-MM-DD").format("DD-MM-YYYY"),
          heureDepart: heureDepart.value ? `${heureDepart.value}:00` : null,
          nbPlace: nbPlace.value,
          prixPersonne: prixPersonne.value,
          voitureId: selectedVoitureId.value,
          statut: "ACTIF",
        };

        const data = await ecorideService(credentials, "/covoiturage/createCovoiturage", "POST", token.value);
        console.log("Covoiturage créé :", data);
        closeModal();
      } catch (errorMessage) {
        console.error("Erreur lors de la création du covoiturage :", errorMessage);
      }
    };

    return {
      closeModal,
      createRide,
      lieuDepart,
      lieuArrivee,
      date,
      nbPlace,
      prixPersonne,
      heureDepart,
      selectedVoitureId,
      voitures,
      isLoading,
      showCreerVoitureModal,
      openCreateCarModal,
      closeCreateCarModal,
      fetchVoitures,  // Inclure la méthode pour la récupération des voitures
    };
  },
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 500px;
}

h2 {
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-grid div {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.voiture-selection {
  margin-top: 1.5rem;
  text-align: left;
}

.voiture-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.voiture-card {
  border: 2px solid #ddd;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.voiture-card:hover {
  background: #f4f4f4;
}

.voiture-card.selected {
  border-color: #385c05;
  background-color: #eaf5d3;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}


/* Style du loader */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #385C05;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.no-voiture {
  text-align: center;
  margin-top: 1rem;
}

.create-car-button {
  background-color: #1a3b0e;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.create-car-button:hover {
  background-color: #377d1d;
}

.btn-creer-width {
  width: 100%;
}

.voiture-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

@media screen and (max-width: 768px) {
  .modal-content {
    padding: 1rem;
    position: initial;
  }

  h2 {
    margin-top: 2rem;
  }

  .voiture-cards {
    max-height: 120px;
    overflow-y: auto;
  }

  .voiture-card {
    font-size: small;
  }
}

</style>
