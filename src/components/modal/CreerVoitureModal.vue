<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Créer une voiture</h2>
      <hr class="modal-divider">

      <!-- Formulaire pour créer une voiture -->
      <form @submit.prevent="createCar">
        <div class="form-grid">
          <div>
            <label for="marque">Marque</label>
            <input id="marque" type="text" v-model="marque" placeholder="Marque" required />
          </div>
          <div>
            <label for="modele">Modèle</label>
            <input id="modele" type="text" v-model="modele" placeholder="Modèle" required />
          </div>
          <div>
            <label for="immatriculation">Immatriculation</label>
            <input id="immatriculation" type="text" v-model="immatriculation" placeholder="Immatriculation" required />
          </div>
          <div>
            <label for="energie">Énergie</label>
            <input id="energie" type="text" v-model="energie" placeholder="Énergie" required />
          </div>
          <div>
            <label for="couleur">Couleur</label>
            <input id="couleur" type="text" v-model="couleur" placeholder="Couleur" required />
          </div>
          <div>
            <label for="datePremiereImmatriculation">Date immat.</label>
            <input id="datePremiereImmatriculation" type="date" v-model="datePremiereImmatriculation"
              placeholder="Date première immatriculation" required />
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
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { useAuthStore } from "@/stores/authStore";
import { ecorideService } from "@/services/backend-api.js";

export default {
  props: {
    showModal: Boolean, // Contrôle l'affichage de la modale
    existingCarData: Object, // Reçoit les données JSON lors de l'appel
  },
  setup(props, { emit }) {

    const authStore = useAuthStore();
    const token = computed(() => authStore.token);
    const marque = ref("");
    const modele = ref("");
    const immatriculation = ref("");
    const energie = ref("");
    const couleur = ref("");
    const datePremiereImmatriculation = ref("");


    const closeModal = () => {
      emit("close");
    };

    const createCar = async () => {
      try {
        const credentials = {
          marque: marque.value,
          modele: modele.value,
          utilisateurId: authStore.user.utilisateurId,
          immatriculation: immatriculation.value,
          energie: energie.value,
          couleur: couleur.value,
          datePremiereImmatriculation: dayjs(datePremiereImmatriculation.value, "YYYY-MM-DD").format("YYYY-MM-DD"),
        };

        const data = await ecorideService(credentials, "/voitures/creationVoiture", "POST", token.value);
        console.log("Voiture créé :", data);
        emit("carCreated");
        closeModal();
      } catch (errorMessage) {
        console.error("Erreur lors de la création de la voiture :", errorMessage);
      }
    };

    return {
      marque,
      modele,
      immatriculation,
      energie,
      couleur,
      datePremiereImmatriculation,
      closeModal,
      createCar,
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

@media screen and (max-width: 768px) {
  h2 {
    margin-top: 2rem;
  }
}
</style>