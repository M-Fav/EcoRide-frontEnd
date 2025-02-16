<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>

      <form @submit.prevent="createRide">
        <div class="form-grid">
          <div>
            <label for="depart">Lieu de départ</label>
            <input id="depart" type="text" v-model="newRide.depart" placeholder="Lieu de départ" required />
          </div>
          <div>
            <label for="destination">Destination</label>
            <input id="destination" type="text" v-model="newRide.destination" placeholder="Destination" required />
          </div>
          <div>
            <label for="date">Date</label>
            <input id="date" type="date" v-model="newRide.date" required />
          </div>
          <div>
            <label for="heure">Heure</label>
            <input id="heure" type="time" v-model="newRide.heure" required />
          </div>
          <div>
            <label for="places">Nombre de places</label>
            <input id="places" type="number" v-model="newRide.places" placeholder="Nombre de places" required />
          </div>
          <div>
            <label for="prix">Prix par personne (€)</label>
            <input id="prix" type="number" v-model="newRide.prix" placeholder="Prix par personne (€)" required />
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
import { ref } from "vue";

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
    const newRide = ref({
      depart: "",
      destination: "",
      date: "",
      heure: "",
      places: "",
      prix: "",
    });

    const closeModal = () => {
      emit("close");
    };

    const createRide = () => {
      console.log("Création d'un covoiturage", newRide.value);
      emit("create", newRide.value);  // Envoi des données du nouveau covoiturage au parent
      closeModal();  // Ferme la modal après la création
    };

    return {
      newRide,
      closeModal,
      createRide,
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
