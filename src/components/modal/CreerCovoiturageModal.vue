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
import { openBankingService } from "@/services/backend-api.js";
import { useAuthStore } from "@/stores/authStore";

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,  // Assure-toi que ce prop est bien requis
    },
    title: {
      type: String,
      required: true,  // Titre dynamique de la modal
    }
  },
  setup(props, { emit }) {

      const authStore = useAuthStore();
      const token = computed(() => authStore.token);
      const lieuDepart= ref("");
      const utilisateurId= ref("");
      const lieuArrivee= ref("");
      const date= ref("");
      const heureDepart= ref("");
      const nbPlace= ref("");
      const prixPersonne= ref("");
      //const voitureId=ref(1);

    const closeModal = () => {
      emit("close");
    };


    const createRide = async () => {
      try {
        const credentials = {
          lieuDepart: lieuDepart.value,
          lieuArrivee: lieuArrivee.value,
          utilisateurId:1,
          date: dayjs(date.value, "YYYY-MM-DD").format("DD-MM-YYYY"),
          heureDepart: "10:00:00",
          nbPlace: nbPlace.value,
          prixPersonne: prixPersonne.value,
          voitureId: 1,
          statut: "ACTIF",
        };

        const data = await openBankingService(credentials, "/covoiturage/createCovoiturage", 'POST', token);
        
        console.log("covoiturage créé :", data.value);
        closeModal();
      } catch (errorMessage) {
        console.error("Erreur lors de la connexion :", errorMessage);
      }

      closeModal();  // Ferme la modal après la création
    };

    return {
      closeModal,
      createRide,
      lieuArrivee,
      lieuDepart,
      date,
      nbPlace,
      prixPersonne,
      heureDepart,
      utilisateurId,
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
  width: 400px;
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
</style>
