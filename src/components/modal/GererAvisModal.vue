<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Gérer les avis reçus</h2>
      <hr class="modal-divider">

      <div v-if="isLoading" class="loader-container">
        <div class="loader"></div>
      </div>

      <div v-else-if="avisList.length">
        <div class="avis-card" v-for="avis in avisList" :key="avis.avisId">
          <div class="avis-details">
            <p><strong>Auteur :</strong> {{ avis.nom }} {{ avis.prenom }}</p>
            <p><strong>Note :</strong> {{ avis.note }}/5 ⭐</p>
            <p><strong>Commentaire :</strong> {{ avis.commentaire }}</p>
          </div>
          <div class="btn-group">
            <button @click="traiterAvis(avis.avisId, 'ACCEPTE')" class="btn-vert">Valider</button>
            <button @click="traiterAvis(avis.avisId, 'REFUSE')" class="btn-rouge">Refuser</button>
          </div>
        </div>
      </div>
      <p v-else>Aucun avis à gérer.</p>

      <button @click="$emit('close')" class="btn-rouge btn-close-position">Fermer</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { ecorideService } from "@/services/backend-api.js";
import { useAuthStore } from "@/stores/authStore";

export default {
  props: {
    showModal: {
        type: Boolean,
        required: true,
      },
  },
  setup() {
    const avisList = ref([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();
    const token = authStore.token;

    const rechercherAvis = async () => {
      isLoading.value = true;
      try {
        const data = await ecorideService("", "/avis/getAvisATraiter", "GET", token);
        avisList.value = data;
        console.log(avisList.value);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
      } finally {
        isLoading.value = false;
      }
    };

    const traiterAvis = async (avisId, decision) => {
      try {
        const credentials = {
          avisId: avisId,
          decision: decision,
        }
        await ecorideService(credentials, "/avis/avisDecision", "PUT", token);
        avisList.value = avisList.value.filter((avis) => avis.id !== avisId);
      } catch (error) {
        console.error("Erreur lors de la validation de l'avis :", error);
      }
      rechercherAvis();
    };

    onMounted(rechercherAvis);

    return {
      avisList,
      isLoading,
      traiterAvis,
      rechercherAvis,
    };
  },
};
</script>

<style scoped>
/* Overlay de la modale */
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

.modal-content > div {
  max-height: 400px; 
  overflow-y: auto; 
}

/* Liste des avis */
.avis-card {
  background: #f9f9f9;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
}

/* Détails de l'avis */
.avis-details p {
  margin: 5px 0;
}

/* Boutons */
.btn-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}


/* Loader */
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
</style>