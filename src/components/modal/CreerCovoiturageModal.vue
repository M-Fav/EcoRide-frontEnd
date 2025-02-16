<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>

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
            <label for="prix">Prix par personne (€)</label>
            <input id="prix" type="number" v-model="prixPersonne" placeholder="Prix par personne (€)" required />
          </div>
        </div>

        <!-- Sélection d'une voiture sous forme de cartes avec un loader -->
        <div class="voiture-selection">
          <h3>Choisir une voiture</h3>

          <div v-if="isLoading" class="loader-container">
            <div class="loader"></div>
          </div>

          <div v-else class="voiture-cards">
            <div 
              v-for="voiture in voitures" 
              :key="voiture.voitureId" 
              class="voiture-card" 
              :class="{ selected: selectedVoitureId === voiture.voitureId }"
              @click="selectedVoitureId = voiture.voitureId"
            >
              <h4>{{ voiture.marque }} - {{ voiture.modele }}</h4>
              <p><strong>Immatriculation:</strong> {{ voiture.immatriculation }}</p>
              <p><strong>Énergie:</strong> {{ voiture.energie }}</p>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="submit" class="create-button">Créer</button>
          <button type="button" class="close-button" @click="closeModal">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { openBankingService } from "@/services/backend-api.js";
import { useAuthStore } from "@/stores/authStore";

export default {
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

    // Récupérer les voitures de l'utilisateur avec un loader
    const fetchVoitures = async () => {
      isLoading.value = true; // Active le chargement
      try {
        const credentialsVoitures = { utilisateurId: utilisateurId.value };
        const data = await openBankingService(credentialsVoitures, "/voitures/recupererVoituresUtilisateur", "GET", token.value);
        voitures.value = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
      } finally {
        isLoading.value = false; // Désactive le chargement après récupération
      }
    };

    onMounted(fetchVoitures);

    const closeModal = () => {
      emit("close");
    };

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

        const data = await openBankingService(credentials, "/covoiturage/createCovoiturage", "POST", token.value);
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
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 500px;
  text-align: center;
  position: relative;
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
  padding: 15px;
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

button {
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.create-button {
  background-color: #385c05;
  color: white;
  border-radius: 5px;
  width: 100%;
}

.create-button:hover {
  background-color: #22963d;
}

.close-button {
  background-color: #a70000;
  width: auto;
  padding: 8px 16px;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close-button:hover {
  background-color: #cc0000;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
